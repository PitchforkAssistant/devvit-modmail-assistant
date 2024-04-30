import {Devvit, FormOnSubmitEventHandler} from "@devvit/public-api";
import {onModMail} from "./triggers/onModMail.js";
import {SETTINGS} from "./settings/settings.js";
import {onAutoArchiver} from "./triggers/onScheduler.js";
import {onAppChanged} from "./triggers/onAppChanged.js";
import {archiverFormButton, createArchiverForm} from "./forms/generators.js";
import {onArchiverFormSubmit} from "./forms/handlers.js";

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

Devvit.addMenuItem({
    label: "Archive Old Modmails",
    location: "subreddit",
    forUserType: "moderator",
    onPress: archiverFormButton,
});

export const archiverFormKey = Devvit.createForm(createArchiverForm, onArchiverFormSubmit as FormOnSubmitEventHandler);

export default Devvit;
