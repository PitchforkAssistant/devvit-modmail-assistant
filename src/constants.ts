// Keeping all of the labels, help texts, error messages, and default values in one place makes keeps main.ts cleaner and makes them easier to change.
// It also opens up the possibility of internationalization in the future.

export const LABELS = {
    USERNAMES: "Usernames",
    ADMINS: "Admins",
    SUBREDDITS: "Subreddits",
    CONTRIBUTORS: "Contributors",
    SENT: "Include Sent",
    AUTOGEN: "Include Auto-Generated",
};

export const HELP_TEXTS = {
    USERNAMES: "A comma-separated list of usernames whose modmails automatically highlighted, leave blank to disable.",
    ADMINS: "Should modmails from admins be automatically highlighted?",
    CONTRIBUTORS: "Should modmails from approved contributors be automatically highlighted?",
    SUBREDDITS: "Should modmails from other subreddits be automatically highlighted?",
    SENT: "Should modmails sent by the subreddit be highlighted if the recipient matches the above criteria?",
    AUTOGEN: "Should automatically generated modmails even be considered for highlighting?",
};

export const DEFAULTS = {
    USERNAMES: "pl00h,PitchforkAssistant,OrAnyOtherUsernamesYouWant",
    ADMINS: true,
    SUBREDDITS: true,
    CONTRIBUTORS: false,
    SENT: true,
    AUTOGEN: false,
};
