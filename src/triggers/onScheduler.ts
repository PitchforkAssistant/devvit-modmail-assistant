import {Context, ScheduledJobEvent} from "@devvit/public-api";
import {getAppSettings} from "../settings/loader.js";
import {runModmailArchiver} from "../features/archiver.js";

export async function onAutoArchiver (_event: ScheduledJobEvent, context: Context) {
    const config = await getAppSettings(context.settings);
    if (config.archiverEnabled) {
        console.log("Running modmail auto-archiver...");
        const count = await runModmailArchiver(context.reddit, config);
        console.log(`Auto-archived ${count} modmails!`);
    }
}
