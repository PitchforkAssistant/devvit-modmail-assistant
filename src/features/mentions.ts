import type {ConversationData, MessageData, RedditClient} from "@devvit/web/server";
import {AppSettings} from "../settings/loader.js";
import {getModmailPermalink} from "../helpers.js";
import {notifyMentionedModerators} from "./notify.js";

// Based on testing, this regex should emulate the behavior of the Reddit username mentions in comments:
// https://i.imgur.com/yMghWaB.png
const usernameMentionRegex = /(?<!(\[|\w)\/?u\/)(?<=\b\/?u\/)[a-zA-Z0-9_-]{3,21}(?=\b)/gm;

const escapedUnderscoreRegex = /\\_/g;
const capitalisedPrefixRegex = /(?<![a-zA-Z0-9_])U\//g;

/**
 * Undoes the two things Reddit does to a typed mention that stop it from matching:
 * markdown-escaped underscores in usernames, and a capitalised prefix from a phone
 * keyboard autocapitalising the start of a message.
 */
export function normaliseMentionText (text: string): string {
    return text.replace(escapedUnderscoreRegex, "_").replace(capitalisedPrefixRegex, "u/");
}

export function extractUniqueUsernameMentions (text: string): string[] {
    const matches = normaliseMentionText(text).matchAll(usernameMentionRegex);
    return [...new Set(Array.from(matches, match => match[0].toLowerCase()))];
}

const quoteRegex = /^\s*?((\d+\.)|\*|-)?\s*?>.*?$/gm;
export function removeQuotes (text: string): string {
    return text.replace(quoteRegex, "");
}

export async function findModeratorMentions (reddit: RedditClient, text: string, subredditName?: string): Promise<string[]> {
    const mentions = extractUniqueUsernameMentions(text);
    console.log(`findModeratorMentions: Extracted ${mentions.length} username mention(s): ${JSON.stringify(mentions)}`);

    if (!mentions.length) {
        return [];
    }

    if (!subredditName) {
        subredditName = (await reddit.getCurrentSubreddit()).name;
    }

    const moderators: string[] = (await reddit.getModerators({subredditName}).all()).map(mod => mod.username.toLowerCase());
    const modMentions: string[] = [];
    for (const username of mentions) {
        if (moderators.includes(username.toLowerCase())) {
            modMentions.push(username);
        }
    }
    console.log(`findModeratorMentions: ${modMentions.length} of ${mentions.length} mention(s) matched the ${moderators.length} moderator(s) of r/${subredditName}`);
    return modMentions;
}

function escapeRegex (value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Keywords are matched as whole tokens so "@modsquad" and "someone@mods.example" don't count.
 * They must be found and removed before username extraction runs, otherwise a keyword like
 * "u/mods" would be treated as a mention of the real u/mods account.
 */
function keywordRegex (keyword: string): RegExp {
    return new RegExp(`(?<![a-zA-Z0-9_])${escapeRegex(keyword)}(?![a-zA-Z0-9_])`, "gi");
}

export function containsAllModsKeyword (text: string, keywords: string[]): boolean {
    return keywords.some(keyword => keywordRegex(keyword).test(text));
}

export function removeAllModsKeywords (text: string, keywords: string[]): string {
    return keywords.reduce((stripped, keyword) => stripped.replace(keywordRegex(keyword), " "), text);
}

export function countAllModsKeywords (convo: ConversationData, keywords: string[], ignoreQuotes: boolean): number {
    let count = 0;
    for (const message of Object.values(convo.messages)) {
        if (!message.bodyMarkdown) {
            continue;
        }
        if (containsAllModsKeyword(ignoreQuotes ? removeQuotes(message.bodyMarkdown) : message.bodyMarkdown, keywords)) {
            count++;
        }
    }
    return count;
}

export function countUsernameMentions (convo: ConversationData, ignoreQuotes: boolean): Record<string, number> {
    const counts: Record<string, number> = {};

    for (const message of Object.values(convo.messages)) {
        if (!message.bodyMarkdown) {
            continue;
        }
        for (const username of extractUniqueUsernameMentions(ignoreQuotes ? removeQuotes(message.bodyMarkdown) : message.bodyMarkdown)) {
            counts[username] = (counts[username] ?? 0) + 1;
        }
    }

    return counts;
}

/**
 * Moderators who can actually be alerted: everyone with mail access, minus the sender,
 * the app's own account, AutoModerator and anyone the subreddit has excluded.
 */
export async function findNotifiableModerators (reddit: RedditClient, subredditName: string, excluded: string[], sender?: string): Promise<string[]> {
    const appUsername = (await reddit.getAppUser())?.username?.toLowerCase();
    const alwaysSkip = new Set([...excluded, "automoderator", appUsername, sender?.toLowerCase()].filter((name): name is string => !!name));

    const moderators = await reddit.getModerators({subredditName}).all();
    const withMailAccess = moderators
        .filter(mod => {
            const permissions = mod.moderatorInfo?.modPermissions ?? [];
            return permissions.includes("all") || permissions.includes("mail");
        })
        .map(mod => mod.username.toLowerCase());

    const recipients = withMailAccess.filter(username => !alwaysSkip.has(username));
    console.log(`findNotifiableModerators: r/${subredditName} has ${moderators.length} moderator(s), ${withMailAccess.length} with mail access, ${recipients.length} to notify after skipping ${JSON.stringify([...alwaysSkip])}`);
    return recipients;
}

async function runAllModsMention (reddit: RedditClient, config: AppSettings, convo: ConversationData, message: MessageData, searchText: string) {
    const keyword = config.modmailMentionsAllModsKeywords.find(candidate => containsAllModsKeyword(searchText, [candidate]));
    if (!keyword) {
        return;
    }

    console.log(`runAllModsMention: Keyword "${keyword}" found in ${convo.id}`);

    if (config.modmailMentionsOnlyOnce && countAllModsKeywords(convo, config.modmailMentionsAllModsKeywords, config.modmailMentionsNoQuotes) > 1) {
        console.log(`runAllModsMention: All mods already alerted in ${convo.id}, skipping`);
        return;
    }

    const subredditName = convo.subreddit?.displayName ?? (await reddit.getCurrentSubreddit()).name;
    const recipients = await findNotifiableModerators(reddit, subredditName, config.modmailMentionsAllModsExcluded, message.author?.name);

    if (!recipients.length) {
        console.log(`runAllModsMention: No notifiable moderators in r/${subredditName}`);
        return;
    }

    if (recipients.length > config.modmailMentionsAllModsLimit) {
        console.log(`runAllModsMention: ${recipients.length} moderators exceeds the limit of ${config.modmailMentionsAllModsLimit}, notifying nobody`);
        return;
    }

    const link = getModmailPermalink(convo, message) ?? "https://mod.reddit.com/mail/all";
    const by = message.author?.name ? `/u/${message.author.name}` : "an unknown user";
    const inSub = convo.subreddit?.displayName ? ` in /r/${convo.subreddit.displayName}` : "";
    const body = `All moderators were mentioned with "${keyword}" in [this modmail message](${link})${inSub} by ${by}.`;

    console.log(`runAllModsMention: Notifying ${recipients.length} moderator(s) of r/${subredditName}`);
    await notifyMentionedModerators(convo, message, recipients, "all moderators mentioned", body);
}

export async function runModmailMentions (reddit: RedditClient, config: AppSettings, convo: ConversationData, messageId: string) {
    if (!config.modmailMentionsEnabled) {
        console.log("runModmailMentions: Mentions are disabled");
        return;
    }

    const message = convo.messages[messageId.replace("ModmailMessage_", "")]; // The message ID may be prefixed with "ModmailMessage_", but the messages objects aren't
    if (!message) {
        console.log(`runModmailMentions: Message not found in ${convo.id}`);
        return;
    }

    if (!message.bodyMarkdown) {
        console.log(`runModmailMentions: Message in ${convo.id} has no body`);
        return;
    }

    console.log(`runModmailMentions: Message ${message.id} raw body: ${JSON.stringify(message.bodyMarkdown)}`);

    const searchText = config.modmailMentionsNoQuotes ? removeQuotes(message.bodyMarkdown) : message.bodyMarkdown;
    if (searchText !== message.bodyMarkdown) {
        console.log(`runModmailMentions: Body after quote removal: ${JSON.stringify(searchText)}`);
    }

    if (config.modmailMentionsOnlyMods && !message.author?.isMod && !message.author?.isAdmin) {
        console.log(`runModmailMentions: Message author ${message.author?.name} can't trigger mentions (isMod: ${String(message.author?.isMod)}, isAdmin: ${String(message.author?.isAdmin)})`);
        return;
    }

    if (config.modmailMentionsAllModsEnabled) {
        await runAllModsMention(reddit, config, convo, message, searchText);
    } else if (containsAllModsKeyword(searchText, config.modmailMentionsAllModsKeywords)) {
        console.log("runModmailMentions: An all-mods keyword was used, but the all-mods feature is disabled");
    }

    // Keywords are removed so a keyword that looks like a username can't also fire an individual mention.
    const mentionText = removeAllModsKeywords(searchText, config.modmailMentionsAllModsKeywords);

    let modMentions = await findModeratorMentions(reddit, mentionText);
    if (!modMentions.length) {
        console.log(`runModmailMentions: No moderator mentions found in ${convo.id}`);
        return;
    }

    if (modMentions.length > 3) { // Reddit only allows 3 mentions per comment, so we'll limit it to that too
        console.log(`runModmailMentions: Too many mentions found (${modMentions.length}), ignoring all of them`);
        return;
    }

    // Filter out any mentions that have already been mentioned in the conversation
    if (config.modmailMentionsOnlyOnce) {
        const counts = countUsernameMentions(convo, config.modmailMentionsNoQuotes);
        modMentions = modMentions.filter(username => {
            // If the username has been mentioned more than once, that means this isn't the first mention.
            if (counts[username] && counts[username] > 1) {
                console.log(`runModmailMentions: ${username} already mentioned in ${convo.id} ${counts[username]} times`);
                return false;
            }
            return true;
        });
    }

    const targets = modMentions.filter(username => {
        if (username === message.author?.name?.toLowerCase()) {
            console.log(`runModmailMentions: Ignoring self-mention by ${username}`);
            return false;
        }
        return true;
    });

    if (targets.length) {
        console.log(`runModmailMentions: Notifying ${targets.length} mentioned moderator(s) for ${convo.id}/${message.id}`);
        await notifyMentionedModerators(convo, message, targets, "username mention");
    }
}
