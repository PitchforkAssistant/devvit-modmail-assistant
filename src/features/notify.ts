import {reddit} from "@devvit/web/server";
import type {ConversationData, MessageData} from "@devvit/web/server";
import {getModmailPermalink} from "../helpers.js";

export type NotifyOutcome = {
    delivered: string[];
    failed: string[];
};

function mentionBody (convo: ConversationData, message: MessageData, sender?: string): string {
    const link = getModmailPermalink(convo, message) ?? "https://mod.reddit.com/mail/all";
    const by = sender ? `/u/${sender}` : "an unknown user";
    const inSub = convo.subreddit?.displayName ? ` in /r/${convo.subreddit.displayName}` : "";
    return `You were mentioned in [this modmail message](${link})${inSub} by ${by}.`;
}

/**
 * Notifies moderators by private message, the only channel that reaches one specific
 * person rather than the whole mod team. Modmail is deliberately not used as a fallback:
 * these are personal notifications, not team ones.
 *
 * A refused message is reported rather than swallowed, so a subreddit whose moderators
 * are not receiving notifications can see that in the app's logs.
 */
export async function notifyMentionedModerators (convo: ConversationData, message: MessageData, usernames: string[], subject: string, body?: string): Promise<NotifyOutcome> {
    const text = body ?? mentionBody(convo, message, message.author?.name);
    const outcome: NotifyOutcome = {delivered: [], failed: []};

    for (const username of usernames) {
        try {
            await reddit.sendPrivateMessage({to: username, subject, text});
            outcome.delivered.push(username);
        } catch (e) {
            outcome.failed.push(username);
            console.error(`notify: private message to ${username} was refused: ${String(e)}`);
        }
    }

    if (outcome.failed.length) {
        console.error(`notify: ${outcome.delivered.length} of ${usernames.length} notified for ${convo.id}, could not reach ${JSON.stringify(outcome.failed)}`);
    } else {
        console.log(`notify: ${outcome.delivered.length} of ${usernames.length} notified for ${convo.id}`);
    }

    return outcome;
}
