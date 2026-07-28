import {reddit} from "@devvit/web/server";
import {getAppSettings} from "../settings/loader.js";
import {runModmailArchiver} from "../features/archiver.js";

export async function onAutoArchiver (): Promise<Record<string, never>> {
    const config = await getAppSettings();
    if (config.archiverEnabled) {
        console.log("Running modmail auto-archiver...");
        const count = await runModmailArchiver(reddit, config);
        console.log(`Auto-archived ${count} modmails!`);
    }
    return {};
}
