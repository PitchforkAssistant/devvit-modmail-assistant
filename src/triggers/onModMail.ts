import {reddit} from "@devvit/web/server";
import type {OnModMailRequest, TriggerResponse} from "@devvit/web/shared";
import {getAppSettings} from "../settings/loader.js";
import {runModmailHighlighter} from "../features/highlighter.js";
import {runModmailMentions} from "../features/mentions.js";

export async function onModMail (body: unknown): Promise<TriggerResponse> {
    const event = body as OnModMailRequest;

    const config = await getAppSettings();
    if (!config.highlighterEnabled && !config.modmailMentionsEnabled) {
        return {};
    }

    console.log(`onModMail: ${event.conversationId}/${event.messageId}`);

    const convoResponse = await reddit.modMail.getConversation({conversationId: event.conversationId, markRead: false});
    if (!convoResponse || !convoResponse.conversation) {
        console.error(`onModMail: Failed to fetch ${event.conversationId}`);
        return {};
    }

    if (config.highlighterEnabled) {
        await runModmailHighlighter(reddit, config, convoResponse.conversation);
    }

    if (config.modmailMentionsEnabled) {
        await runModmailMentions(reddit, config, convoResponse.conversation, event.messageId);
    }

    return {};
}
