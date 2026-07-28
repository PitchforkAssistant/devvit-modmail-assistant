import {createServer, getServerPort} from "@devvit/web/server";
import type {IncomingMessage, ServerResponse} from "node:http";
import {onModMail} from "./triggers/onModMail.js";
import {onAutoArchiver} from "./triggers/onScheduler.js";
import {onArchiverMenuItem} from "./forms/generators.js";
import {onArchiverFormSubmit} from "./forms/handlers.js";

export type RouteHandler = (body: unknown) => Promise<unknown>;

const routes: Record<string, RouteHandler> = {
    "/internal/triggers/modmail": onModMail,
    "/internal/scheduler/auto-archiver": onAutoArchiver,
    "/internal/menu/archiver": onArchiverMenuItem,
    "/internal/forms/archiver": onArchiverFormSubmit,
};

async function readJsonBody (request: IncomingMessage): Promise<unknown> {
    const chunks: Buffer[] = [];
    for await (const chunk of request) {
        chunks.push(chunk as Buffer);
    }
    const raw = Buffer.concat(chunks).toString("utf8");
    return raw ? JSON.parse(raw) : {};
}

function writeJson (response: ServerResponse, status: number, body: unknown) {
    // Devvit rejects responses without an explicit Content-Length, which Node omits when it chunks.
    const payload = Buffer.from(JSON.stringify(body ?? {}), "utf8");
    response.writeHead(status, {
        "Content-Type": "application/json",
        "Content-Length": payload.byteLength,
    });
    response.end(payload);
}

async function onRequest (request: IncomingMessage, response: ServerResponse): Promise<void> {
    const path = (request.url ?? "").split("?")[0];
    const handler = routes[path];

    if (!handler) {
        console.warn(`onRequest: No handler for ${request.method ?? "?"} ${path}`);
        writeJson(response, 404, {error: "not found"});
        return;
    }

    try {
        writeJson(response, 200, await handler(await readJsonBody(request)) ?? {});
    } catch (e) {
        console.error(`onRequest: Unhandled error in ${path}: ${String(e)}`);
        writeJson(response, 500, {error: String(e)});
    }
}

const server = createServer(onRequest);
server.on("error", err => console.error(`Server error: ${err.stack ?? String(err)}`));
server.listen(getServerPort());
