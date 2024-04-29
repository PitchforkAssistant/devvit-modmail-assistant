import {AppInstall, AppUpgrade} from "@devvit/protos";
import {startSingletonJob} from "devvit-helpers";
import {TriggerContext} from "@devvit/public-api";

export async function onAppChanged (event: AppInstall | AppUpgrade, context: TriggerContext) {
    console.log("App installed or upgraded, restarting jobs");
    await startSingletonJob(context.scheduler, "autoArchiver", "* * * * *");
}
