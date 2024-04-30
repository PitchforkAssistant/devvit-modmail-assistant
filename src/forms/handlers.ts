import {Context} from "@devvit/public-api";
import {ArchiverSettings, runModmailArchiver} from "../features/archiver.js";

export type ArchiverFormOnSubmitEvent = {
    values: ArchiverSettings;
}

export async function onArchiverFormSubmit (event: ArchiverFormOnSubmitEvent, context: Context) {
    const config = event.values;
    if (typeof config.archiverNoHighlighteds !== "boolean") {
        context.ui.showToast(`ERROR: Invalid value for archiverNoHighlighteds (got ${String(config.archiverNoHighlighteds)})`);
        console.error("onArchiverFormSubmit: Invalid value for archiverNoHighlighteds", config.archiverNoHighlighteds);
        return;
    }

    if (typeof config.archiveLastReplyUser !== "number" || config.archiveLastReplyUser <= 0) {
        context.ui.showToast(`ERROR: Archive - Last Reply From User must be a number above 0 (got ${String(config.archiveLastReplyUser)})`);
        console.log("onArchiverFormSubmit: Invalid value for archiveLastReplyUser", config.archiveLastReplyUser);
        return;
    }

    if (typeof config.archiveLastReplyMod !== "number" || config.archiveLastReplyMod <= 0) {
        context.ui.showToast(`ERROR: Archive - Last Reply From Mod must be a number above 0 (got ${String(config.archiveLastReplyMod)})`);
        console.log("onArchiverFormSubmit: Invalid value for archiveLastReplyMod", config.archiveLastReplyMod);
        return;
    }

    if (typeof config.archiveAutoGenerated !== "number" || config.archiveAutoGenerated <= 0) {
        context.ui.showToast(`ERROR: Archive - Auto-Generated With No Replies must be a number above 0 (got ${String(config.archiveAutoGenerated)})`);
        console.log("onArchiverFormSubmit: Invalid value for archiveAutoGenerated", config.archiveAutoGenerated);
        return;
    }

    context.ui.showToast("Archiver started. This may take a while...");
    console.log("Running manual modmail archiver...");
    const archivedModmail = await runModmailArchiver(context.reddit, config);
    context.ui.showToast({text: `Archiver finished. Archived ${archivedModmail} modmails.`, appearance: "success"});
    console.log(`Manual archiver run finished. Archived ${archivedModmail} modmails.`);
}
