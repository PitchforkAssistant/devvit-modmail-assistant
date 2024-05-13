# ModmailAssistant

ModmailAssistant is a Devvit app that provides a few useful Modmail-related tools. Each of these tools come with some configuration options and can be enabled or disabled individually to your liking.

* Auto-Highlighter  
  Automatically highlight new modmail conversations from the admins or specific users.

* Auto-Archiver  
  Automatically archive modmail conversations after a certain amount of time has passed from the last reply.

* Modmail Mentions  
  This brings username mentions to modmail conversations. Have you ever wanted to ask another mod a question in modmail? Now you can get their attention by /u/-mentioning them, which will send them a private message with a link to the conversation.

## Change Log

This section summarizes the changes made for each published version of the app, unpublished versions are not listed, but you can always view the full changes to the code on [GitHub](https://github.com/PitchforkAssistant/devvit-modmail-assistant).

### 0.1.4

- Added an option to ignore modmail /u/-mentions if they are inside a quote block. Enabled by default.

- Fixed an issue where manually running the archiver would never work due to an incorrect permission check.

### 0.1.3

- Fixed a bug that prevented the highlighter function from ever running.
