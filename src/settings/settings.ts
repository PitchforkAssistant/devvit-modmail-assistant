import {SettingsFormFieldGroup, ValidatedBooleanField, ValidatedNumberField, ValidatedParagraphField, ValidatedSelectField, ValidatedStringField} from "@devvit/public-api";
import {GROUP_HELP_TEXTS, GROUP_LABELS, SETTING_HELP_TEXTS, SETTING_LABELS} from "./strings.js";
import {SETTING_DEFAULTS} from "./defaults.js";

export type HighlighterSettingName = "highlighterEnabled"
                                   | "highlighterAdmins"
                                   | "highlighterContributors"
                                   | "highlighterUsernames"
                                   | "highlighterFlairs"
                                   | "highlighterSubreddits"
                                   | "highlighterNoSents"
                                   | "highlighterNoAutoGens";

export type ArchiverSettingName = "archiverEnabled"
                                | "archiverNoHighlighteds"
                                | "archiveLastReplyUser"
                                | "archiveLastReplyMod"
                                | "archiveAutoGenerated";

export type ModmailMentionsSettingName = "modmailMentionsEnabled"
                                       | "modmailMentionsOnlyMods"
                                       | "modmailMentionsOnlyOnce";

export type AppSettingName = HighlighterSettingName | ArchiverSettingName | ModmailMentionsSettingName;

export const SETTING_NAMES: Record<AppSettingName, AppSettingName> = {
    highlighterEnabled: "highlighterEnabled",
    highlighterAdmins: "highlighterAdmins",
    highlighterContributors: "highlighterContributors",
    highlighterUsernames: "highlighterUsernames",
    highlighterFlairs: "highlighterFlairs",
    highlighterSubreddits: "highlighterSubreddits",
    highlighterNoSents: "highlighterNoSents",
    highlighterNoAutoGens: "highlighterNoAutoGens",
    archiverEnabled: "archiverEnabled",
    archiverNoHighlighteds: "archiverNoHighlighteds",
    archiveLastReplyUser: "archiveLastReplyUser",
    archiveLastReplyMod: "archiveLastReplyMod",
    archiveAutoGenerated: "archiveAutoGenerated",
    modmailMentionsEnabled: "modmailMentionsEnabled",
    modmailMentionsOnlyMods: "modmailMentionsOnlyMods",
    modmailMentionsOnlyOnce: "modmailMentionsOnlyOnce",
};

export type AppSettingsFormField = Omit<ValidatedStringField, "name"> & {name: AppSettingName}
                                 | Omit<ValidatedParagraphField, "name"> & {name: AppSettingName}
                                 | Omit<ValidatedNumberField, "name"> & {name: AppSettingName}
                                 | Omit<ValidatedBooleanField, "name"> & {name: AppSettingName}
                                 | Omit<ValidatedSelectField, "name"> & {name: AppSettingName}
                                 | Omit<SettingsFormFieldGroup, "fields"> & {fields: AppSettingsFormField[]};

export const SETTINGS: AppSettingsFormField[] = [
    {
        type: "group",
        label: GROUP_LABELS.mentions,
        helpText: GROUP_HELP_TEXTS.mentions,
        fields: [
            {
                type: "boolean",
                name: SETTING_NAMES.modmailMentionsEnabled,
                label: SETTING_LABELS.modmailMentionsEnabled,
                helpText: SETTING_HELP_TEXTS.modmailMentionsEnabled,
                defaultValue: SETTING_DEFAULTS.modmailMentionsEnabled,
            },
            {
                type: "boolean",
                name: SETTING_NAMES.modmailMentionsOnlyMods,
                label: SETTING_LABELS.modmailMentionsOnlyMods,
                helpText: SETTING_HELP_TEXTS.modmailMentionsOnlyMods,
                defaultValue: SETTING_DEFAULTS.modmailMentionsOnlyMods,
            },
            {
                type: "boolean",
                name: SETTING_NAMES.modmailMentionsOnlyOnce,
                label: SETTING_LABELS.modmailMentionsOnlyOnce,
                helpText: SETTING_HELP_TEXTS.modmailMentionsOnlyOnce,
                defaultValue: SETTING_DEFAULTS.modmailMentionsOnlyOnce,
            },
        ],
    },
    {
        type: "group",
        label: GROUP_LABELS.highlighter,
        helpText: GROUP_HELP_TEXTS.highlighter,
        fields: [
            {
                type: "boolean",
                name: SETTING_NAMES.highlighterEnabled,
                label: SETTING_LABELS.highlighterEnabled,
                helpText: SETTING_HELP_TEXTS.highlighterEnabled,
                defaultValue: SETTING_DEFAULTS.highlighterEnabled,
            },
            {
                type: "boolean",
                name: SETTING_NAMES.highlighterAdmins,
                label: SETTING_LABELS.highlighterAdmins,
                helpText: SETTING_HELP_TEXTS.highlighterAdmins,
                defaultValue: SETTING_DEFAULTS.highlighterAdmins,
            },
            {
                type: "boolean",
                name: SETTING_NAMES.highlighterContributors,
                label: SETTING_LABELS.highlighterContributors,
                helpText: SETTING_HELP_TEXTS.highlighterContributors,
                defaultValue: SETTING_DEFAULTS.highlighterContributors,
            },
            {
                type: "boolean",
                name: SETTING_NAMES.highlighterNoSents,
                label: SETTING_LABELS.highlighterNoSents,
                helpText: SETTING_HELP_TEXTS.highlighterNoSents,
                defaultValue: SETTING_DEFAULTS.highlighterNoSents,
            },
            {
                type: "boolean",
                name: SETTING_NAMES.highlighterNoAutoGens,
                label: SETTING_LABELS.highlighterNoAutoGens,
                helpText: SETTING_HELP_TEXTS.highlighterNoAutoGens,
                defaultValue: SETTING_DEFAULTS.highlighterNoAutoGens,
            },
            {
                type: "string",
                name: SETTING_NAMES.highlighterUsernames,
                label: SETTING_LABELS.highlighterUsernames,
                helpText: SETTING_HELP_TEXTS.highlighterUsernames,
                defaultValue: SETTING_DEFAULTS.highlighterUsernames,
            },
            {
                type: "string",
                name: SETTING_NAMES.highlighterFlairs,
                label: SETTING_LABELS.highlighterFlairs,
                helpText: SETTING_HELP_TEXTS.highlighterFlairs,
                defaultValue: SETTING_DEFAULTS.highlighterFlairs,
                disabled: true, // Disabled until getUserFlairBySubreddit starts returning the template ID
            },
            {
                type: "boolean",
                name: SETTING_NAMES.highlighterSubreddits,
                label: SETTING_LABELS.highlighterSubreddits,
                helpText: SETTING_HELP_TEXTS.highlighterSubreddits,
                defaultValue: SETTING_DEFAULTS.highlighterSubreddits,
                disabled: true, // Disabled until the modmail issue with receiving messages from other subreddits is resolved
            },
        ],
    },
    {
        type: "group",
        label: GROUP_LABELS.archiver,
        helpText: GROUP_HELP_TEXTS.archiver,
        fields: [
            {
                type: "boolean",
                name: SETTING_NAMES.archiverEnabled,
                label: SETTING_LABELS.archiverEnabled,
                helpText: SETTING_HELP_TEXTS.archiverEnabled,
                defaultValue: SETTING_DEFAULTS.archiverEnabled,
            },
            {
                type: "boolean",
                name: SETTING_NAMES.archiverNoHighlighteds,
                label: SETTING_LABELS.archiverNoHighlighteds,
                helpText: SETTING_HELP_TEXTS.archiverNoHighlighteds,
                defaultValue: SETTING_DEFAULTS.archiverNoHighlighteds,
            },
            {
                type: "number",
                name: SETTING_NAMES.archiveLastReplyUser,
                label: SETTING_LABELS.archiveLastReplyUser,
                helpText: SETTING_HELP_TEXTS.archiveLastReplyUser,
                defaultValue: SETTING_DEFAULTS.archiveLastReplyUser,
            },
            {
                type: "number",
                name: SETTING_NAMES.archiveLastReplyMod,
                label: SETTING_LABELS.archiveLastReplyMod,
                helpText: SETTING_HELP_TEXTS.archiveLastReplyMod,
                defaultValue: SETTING_DEFAULTS.archiveLastReplyMod,
            },
            {
                type: "number",
                name: SETTING_NAMES.archiveAutoGenerated,
                label: SETTING_LABELS.archiveAutoGenerated,
                helpText: SETTING_HELP_TEXTS.archiveAutoGenerated,
                defaultValue: SETTING_DEFAULTS.archiveAutoGenerated,
            },
        ],
    },
];
