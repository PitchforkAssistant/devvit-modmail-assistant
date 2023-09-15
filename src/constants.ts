// Keeping all of the labels, help texts, error messages, and default values in one place makes keeps main.ts cleaner and makes them easier to change.
// It also opens up the possibility of internationalization in the future.

export const LABELS = {
    USERNAMES: "Usernames",
    ADMINS: "Admins",
    SUBREDDITS: "Subreddits",
    CONTRIBUTORS: "Contributors",
    AUTOGEN: "Include Auto-Generated",
};

export const HELP_TEXTS = {
    USERNAMES: "A comma-separated list of usernames whose modmails automatically highlighted, leave blank to disable.",
    ADMINS: "Should modmails from admins be automatically highlighted?",
    CONTRIBUTORS: "Should modmails from approved contributors be automatically highlighted?",
    SUBREDDITS: "Should modmails from other subreddits be automatically highlighted?",
    AUTOGEN: "Should automatically generated modmails even be considered for highlighting?",
};

export const DEFAULTS = {
    USERNAMES: "pl00h,PitchforkAssistant,OrAnyOtherUsernamesYouWant",
    ADMINS: true,
    SUBREDDITS: true,
    CONTRIBUTORS: false,
    AUTOGEN: false,
};
