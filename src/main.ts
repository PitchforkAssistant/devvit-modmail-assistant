import {Devvit} from "@devvit/public-api";
import {onModMail} from "./triggers/onModMail.js";
import {SETTINGS} from "./settings/settings.js";
import {onAutoArchiver} from "./triggers/onScheduler.js";
import {onAppChanged} from "./triggers/onAppChanged.js";

// Enable any Devvit features you might need.
Devvit.configure({
    redditAPI: true,
});

// Set up the configuration field presented to the user for each installation (subreddit) of the app.
Devvit.addSettings(SETTINGS);

Devvit.addTrigger({
    event: "ModMail",
    onEvent: onModMail,
});

Devvit.addTrigger({
    events: ["AppInstall", "AppUpgrade"],
    onEvent: onAppChanged,
});

Devvit.addSchedulerJob({
    name: "autoArchiver",
    onRun: onAutoArchiver,
});

export default Devvit;
