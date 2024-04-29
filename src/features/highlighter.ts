import {ConversationData, ModMailConversationState, RedditAPIClient} from "@devvit/public-api";
import {AppSettings} from "../settings/loader.js";

export async function runModmailHighlighter (reddit: RedditAPIClient, config: AppSettings, convo: ConversationData): Promise<boolean> {
    if (!config.highlighterEnabled) {
        console.log("runModmailHighlighter: Highlighter is disabled");
        return false;
    }

    // Basic checks to see if we should even bother evaluating this conversation

    if (!convo.id) {
        console.log("runModmailHighlighter: Conversation has no ID");
        return false;
    }
    if (convo.numMessages ?? 0 > 1) {
        console.log("runModmailHighlighter: More than one message in conversation, not a new one");
        return false;
    }
    if (convo.isHighlighted) {
        console.log("runModmailHighlighter: Conversation is already highlighted");
        return false;
    }
    if (convo.state === ModMailConversationState.Archived) {
        console.log("runModmailHighlighter: Conversation is archived");
        return false;
    }

    // Evaluate the conversation for highlighting based on the config

    // Check and possibly skip highlighting for auto-generated modmails
    if (config.highlighterNoAutoGens && convo.isAuto) {
        console.log("runModmailHighlighter: Conversation is auto-generated");
        return false;
    }

    // Check and possibly skip highlighting for modmails sent by the subreddit
    if (config.highlighterNoSents) {
        // If the participant exists and isn't an op, then it's a sent modmail.
        if (convo.participant && !convo.participant.isOp) {
            console.log("runModmailHighlighter: Participant is not conversation OP");
            return false;
        }
        // If the sub2sub conversation is owned by the current subreddit, then it's a sent modmail.
        if (convo.conversationType === "sr_sr" && convo.subreddit?.id === (await reddit.getCurrentSubreddit()).id) {
            console.log("runModmailHighlighter: Conversation was sent to another subreddit by this subreddit");
            return false;
        }
    }

    if (config.highlighterAdmins && convo.participant?.isAdmin) {
        console.log("runModmailHighlighter: Participant is an admin");
        await reddit.modMail.highlightConversation(convo.id);
        return true;
    }

    if (config.highlighterContributors && convo.participant?.isApproved) {
        console.log("runModmailHighlighter: Participant is a contributor");
        await reddit.modMail.highlightConversation(convo.id);
        return true;
    }

    if (config.highlighterUsernames.length > 0 && convo.participant?.name && config.highlighterUsernames.includes(convo.participant.name.toLowerCase())) {
        console.log("runModmailHighlighter: Participant is in the username list");
        await reddit.modMail.highlightConversation(convo.id);
        return true;
    }

    if (config.highlighterSubreddits && convo.conversationType === "sr_sr") {
        console.log("runModmailHighlighter: Conversation is subreddit-to-subreddit");
        await reddit.modMail.highlightConversation(convo.id);
        return true;
    }

    return false;
}
