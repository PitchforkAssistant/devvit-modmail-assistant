import {AppSettingName} from "./settings.js";

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
    archiveLastReplyUser: "Time To Archive If Last Reply Was By User",
    archiveLastReplyMod: "Time To Archive If Last Reply Was By Mod",
    archiveAutoGenerated: "Time To Archive Auto-Generated Modmails",
    modmailMentionsEnabled: "Modmail Mentions Enabled",
    modmailMentionsOnlyMods: "Modmail Mentions Only From Mods",
    modmailMentionsOnlyOnce: "Modmail Mentions Limit To One Mention",
};

export const SETTING_HELP_TEXTS: Record<AppSettingName, string> = {
    highlighterEnabled: "Enable the Auto-Highlighter feature.",
    highlighterAdmins: "Highlight modmails from Reddit admins.",
    highlighterContributors: "Highlight modmails from subreddit contributors.",
    highlighterUsernames: "Highlight modmails from specific users.",
    highlighterFlairs: "Highlight modmails based on user flairs.",
    highlighterSubreddits: "Highlight modmails from other subreddits.",
    highlighterNoSents: "Don't highlight modmails sent by the subreddit.",
    highlighterNoAutoGens: "Don't highlight auto-generated modmails.",
    archiverEnabled: "Enable the Auto-Archiver feature.",
    archiverNoHighlighteds: "Don't archive modmails that have been highlighted.",
    archiveLastReplyUser: "Time in hours to archive if the last reply to the conversation was by a user.",
    archiveLastReplyMod: "Time in hours to archive if the last reply to the conversation was by a mod.",
    archiveAutoGenerated: "Time in hours to archive auto-generated modmails.",
    modmailMentionsEnabled: "Enable the Modmail Mentions feature.",
    modmailMentionsOnlyMods: "Only send out notifications if the username mention is by another moderator. If you disable this, non-moderators will also be able to trigger notifications by mentioning a moderator in a modmail conversation.",
    modmailMentionsOnlyOnce: "Limit the number of notifications sent to a specific moderator to a maximum of one per modmail conversation.",
};

export const GROUP_LABELS: Record<string, string> = {
    highlighter: "Auto-Highlighter",
    archiver: "Auto-Archiver",
    mentions: "Modmail Mentions",
};

export const GROUP_HELP_TEXTS: Record<string, string> = {
    highlighter: "Automatically highlight some new modmail conversations.",
    archiver: "Automatically archive old modmails.",
    mentions: "Notify moderators via private message when they are mentioned in modmail conversation.",
};
