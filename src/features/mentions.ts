import {ConversationData, RedditAPIClient} from "@devvit/public-api";
import {AppSettings} from "../settings/loader.js";
import {isModerator, getModmailPermalink} from "devvit-helpers";

// Based on testing, this regex should emulate the behavior of the Reddit username mentions in comments:
// https://i.imgur.com/yMghWaB.png
const usernameMentionRegex = /(?<!(\[|\w)\/?u\/)(?<=\b\/?u\/)[a-zA-Z0-9_-]{3,21}(?=\b)/gm;
export function extractUsernameMentions (text: string): string[] {
    const matches = text.matchAll(usernameMentionRegex);
    return [...new Set(Array.from(matches, match => match[0].toLowerCase()))];
}

export async function findModeratorMentions (reddit: RedditAPIClient, text: string, subredditName?: string): Promise<string[]> {
    const mentions = extractUsernameMentions(text);

    if (!mentions.length) {
        return [];
    }

    if (!subredditName) {
        subredditName = (await reddit.getCurrentSubreddit()).name;
    }

    return mentions.filter(async username => isModerator(reddit, (await reddit.getCurrentSubreddit()).name, username));
}

export function countUsernameMentions (convo: ConversationData): Record<string, number> {
    const counts: Record<string, number> = {};

    for (const message of Object.values(convo.messages)) {
        for (const username of extractUsernameMentions(message.body ?? "")) {
            counts[username] = (counts[username] ?? 0) + 1;
        }
    }

    return counts;
}

export async function sendMentionNotification (reddit: RedditAPIClient, target: string, link: string, sender?: string) {
    await reddit.sendPrivateMessage({
        to: target,
        subject: "username mention",
        text: `You were mentioned in [this modmail message](${link}) by ${sender ? `/u/${sender}` : "an unknown user"}.`,
    });
}

export async function runModmailMentions (reddit: RedditAPIClient, config: AppSettings, convo: ConversationData, messageId: string) {
    if (!config.modmailMentionsEnabled) {
        console.log("runModmailMentions: Mentions are disabled");
        return;
    }

    const message = convo.messages[messageId.replace("ModmailMessage_", "")]; // The message ID may be prefixed with "ModmailMessage_", but the messages objects aren't
    if (!message) {
        console.log(`runModmailMentions: Message not found in ${convo.id}`);
        return;
    }

    if (config.modmailMentionsOnlyMods && !message.author?.isMod && !message.author?.isAdmin) {
        console.log(`runModmailMentions: Message author ${message.author?.name} can't trigger mentions`);
        return;
    }

    let modMentions = await findModeratorMentions(reddit, message.bodyMarkdown ?? "");
    if (!modMentions.length) {
        console.log("runModmailMentions: No mentions found");
        return;
    }

    if (modMentions.length > 3) { // Reddit only allows 3 mentions per comment, so we'll limit it to that too
        console.log("runModmailMentions: Too many mentions found");
        return;
    }

    // Filter out any mentions that have already been mentioned in the conversation
    if (config.modmailMentionsOnlyOnce) {
        const counts = countUsernameMentions(convo);
        modMentions = modMentions.filter(username => {
            // If the username has been mentioned more than once, that means this isn't the first mention.
            if (counts[username] && counts[username] > 1) {
                console.log(`runModmailMentions: ${username} already mentioned in ${convo.id} ${counts[username]} times`);
                return false;
            }
            return true;
        });
    }

    for (const username of modMentions) {
        try {
            await sendMentionNotification(reddit, username, getModmailPermalink(convo, message) ?? "https://mod.reddit.com/mail/all", message.author?.name);
        } catch (e) {
            console.error(`runModmailMentions: Failed to send mention notification for ${username} in ${convo.id}: ${String(e)}`);
        }
    }
}
