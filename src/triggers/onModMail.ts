import {ModMail} from "@devvit/protos";
import {TriggerContext} from "@devvit/public-api";
import {getAppSettings} from "../settings/loader.js";
import {runModmailHighlighter} from "../features/highlighter.js";
import {runModmailMentions} from "../features/mentions.js";

export async function onModMail (event: ModMail, context: TriggerContext) {
    const config = await getAppSettings(context.settings);
    if (!config.highlighterEnabled && !config.modmailMentionsEnabled) {
        return;
    }

    console.log(`onModMail: ${event.conversationId}/${event.messageId}`);

    const convoResponse = await context.reddit.modMail.getConversation({conversationId: event.conversationId, markRead: false});
    if (!convoResponse || !convoResponse.conversation) {
        console.error(`onModMail: Failed to fetch ${event.conversationId}`);
        return;
    }

    if (config.highlighterEnabled) {
        await runModmailHighlighter(context.reddit, config, convoResponse.conversation);
    }

    if (config.modmailMentionsEnabled) {
        await runModmailMentions(context.reddit, config, convoResponse.conversation, event.messageId);
    }
}
