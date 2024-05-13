import {AppSettingName} from "./settings.js";
// TODO: Improve labels and help texts
export const SETTING_LABELS: Record<AppSettingName, string> = {
    highlighterEnabled: "Auto-Highlighter Enabled",
    highlighterAdmins: "Highlight Modmails From Admins",
    highlighterContributors: "Highlight Modmails From Contributors",
    highlighterUsernames: "Highlight Modmails From Specific Users",
    highlighterFlairs: "Highlight Modmails Based On User Flairs",
    highlighterSubreddits: "Highlight Modmails From Other Subreddits",
    highlighterNoSents: "Don't Highlight Sent Modmails",
    highlighterNoAutoGens: "Don't Highlight Auto-Generated Modmails",

    archiverEnabled: "Auto-Archiver Enabled",
    archiverNoHighlighteds: "Don't Archive Highlighted Modmails",
    archiveLastReplyUser: "Time To Archive If Last Reply Was By User (hours)",
    archiveLastReplyMod: "Time To Archive If Last Reply Was By Mod (hours)",
    archiveAutoGenerated: "Time To Archive Auto-Generated Modmails (hours)",

    modmailMentionsEnabled: "Modmail Mentions Enabled",
    modmailMentionsOnlyMods: "Modmail Mentions Only From Mods",
    modmailMentionsOnlyOnce: "Modmail Mentions Limit To One Mention",
    modmailMentionsNoQuotes: "Modmail Mentions Ignore Quotes",
};

export const SETTING_HELP_TEXTS: Record<AppSettingName, string> = {
    highlighterEnabled: "Enable the Auto-Highlighter feature.",
    highlighterAdmins: "If enabled, new modmail conversations received from Reddit admins will be automatically highlighted.",
    highlighterContributors: "If enabled, new conversations created by approved members aka contributors will be automatically highlighted.",
    highlighterUsernames: "Messages from these users will be highlighted. Please enter their usernames separated by commas, do not include the prefixes.",
    highlighterFlairs: "Coming later, pending Devvit support for retrieving a user flair's template ID.",
    highlighterSubreddits: "Unavailable until Devvit's ModMail trigger starts firing for modmails received from other subreddits.",
    highlighterNoSents: "Modmail conversations initiated by the subreddit will not be highlighted, even if they match the other criteria.",
    highlighterNoAutoGens: "Automatically generated modmails will not be highlighted, this primarily means modmails generated by AutoModerator.",

    archiverEnabled: "Enable the Auto-Archiver feature. If you disable this, you will still be able to manually run the archiver using a button in the subreddit menu.",
    archiverNoHighlighteds: "Never automatically archive highlighted modmails.",
    archiveLastReplyUser: "If the last reply to a modmail conversation was by a user and it's older than this many hours, it will be archived.",
    archiveLastReplyMod: "If the last reply to a modmail conversation was by a moderator and it's older than this many hours, it will be archived.",
    archiveAutoGenerated: "If the modmail conversation was automatically generated and has no replies from moderators, it will be archived if it's older than this many hours.",

    modmailMentionsEnabled: "Enable the Modmail Mentions feature.",
    modmailMentionsOnlyMods: "Only send out notifications if the username mention is by another moderator. If you disable this, non-moderators will also be able to trigger notifications by mentioning a moderator in a modmail conversation.",
    modmailMentionsOnlyOnce: "Limit the number of notifications sent to a singular moderator to a maximum of one per modmail conversation.",
    modmailMentionsNoQuotes: "Ignore any mentions that are inside a quote block.",
};

export const GROUP_LABELS: Record<string, string> = {
    highlighter: "Auto-Highlighter",
    archiver: "Auto-Archiver",
    mentions: "Modmail Mentions",
};

export const GROUP_HELP_TEXTS: Record<string, string> = {
    highlighter: "Automatically highlight important new modmail conversations.",
    archiver: "Automatically archive old modmails.",
    mentions: "Notify moderators via private message when they are mentioned in modmail conversation.",
};
