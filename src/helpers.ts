import type {ConversationData, GetConversationsRequest, MessageData, ModeratorPermission, ModMailService, RedditClient} from "@devvit/web/server";

const MAX_CONVERSATIONS_PER_PAGE = 100;

export type ModmailPermalink = `https://mod.reddit.com/mail/perma/${string}`;

export function getModmailPermalink (conversation: string | ConversationData, message?: string | MessageData): ModmailPermalink | undefined {
    const conversationId = typeof conversation === "string" ? conversation : conversation.id;
    if (!conversationId) {
        return undefined;
    }

    const messageId = typeof message === "string" ? message : message?.id;
    if (messageId) {
        return `https://mod.reddit.com/mail/perma/${conversationId}/${messageId}`;
    }
    return `https://mod.reddit.com/mail/perma/${conversationId}`;
}

function lastUpdateFor (conversation: ConversationData, sortOrder: string): string | undefined {
    switch (sortOrder) {
    case "mod":
        return conversation.lastModUpdate;
    case "user":
        return conversation.lastUserUpdate;
    case "unread":
        return conversation.lastUnread;
    default:
        return conversation.lastUpdated;
    }
}

export function sortConversations (conversations: ConversationData[], sortOrder: string): ConversationData[] {
    return [...conversations].sort((a, b) => {
        const aDate = lastUpdateFor(a, sortOrder);
        const bDate = lastUpdateFor(b, sortOrder);
        if (!aDate && !bDate) {
            return 0;
        }
        if (!aDate) {
            return 1;
        }
        if (!bDate) {
            return -1;
        }
        return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
}

/**
 * Retrieves modmail conversations, paginating past the 100 per request cap that getConversations is limited to.
 */
export async function getModmailConversations (modMail: ModMailService, options: GetConversationsRequest & {limit?: number}): Promise<ConversationData[]> {
    const wanted = options.limit ?? MAX_CONVERSATIONS_PER_PAGE;
    const conversations: ConversationData[] = [];
    const seen = new Set<string>();
    let after = options.after;

    while (conversations.length < wanted) {
        const pageSize = Math.min(MAX_CONVERSATIONS_PER_PAGE, wanted - conversations.length);
        const response = await modMail.getConversations({...options, after, limit: pageSize});
        const page = response.conversationIds.map(id => response.conversations[id]).filter((convo): convo is ConversationData => !!convo);

        const fresh = page.filter(convo => convo.id && !seen.has(convo.id));
        for (const convo of fresh) {
            seen.add(convo.id as string);
            conversations.push(convo);
        }

        if (!fresh.length || page.length < pageSize) {
            break;
        }
        after = page[page.length - 1]?.id;
    }

    return sortConversations(conversations, options.sort ?? "recent");
}

export function getTimeDeltaInSeconds (a: Date, b: Date): number {
    return Math.abs(a.getTime() - b.getTime()) / 1000;
}

export async function hasPermissions (reddit: RedditClient, options: {username: string; subredditName: string; requiredPerms: ModeratorPermission | ModeratorPermission[]}): Promise<boolean> {
    const required = Array.isArray(options.requiredPerms) ? options.requiredPerms : [options.requiredPerms];
    const moderators = await reddit.getModerators({subredditName: options.subredditName, username: options.username}).all();

    const moderator = moderators.find(mod => mod.username.toLowerCase() === options.username.toLowerCase());
    if (!moderator) {
        return false;
    }

    const granted = moderator.moderatorInfo?.modPermissions ?? [];
    if (granted.includes("all")) {
        return true;
    }
    return required.every(permission => granted.includes(permission));
}
