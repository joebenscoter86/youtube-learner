# Installing the YouTube Learner (instructions for Claude)

A person pasted a message asking you to read this file and follow it. They may never have used a terminal. Do every step yourself. Never ask them to type a command; tell them only when they need to click something, answer a window or type their Mac password, and say exactly what they will see.

## 1. Tell them what is about to happen

In two or three plain sentences: you will install the YouTube Learner plugin into Claude Code, then check their Mac for the free tools it needs and install whatever is missing. It takes about 10 to 20 minutes, mostly downloading, and about 3 GB of space. Nothing is paid and nothing signs in to any account. It only runs on a Mac.

If `uname -s` is not `Darwin`, stop here and explain that it is Mac only for now (the README's "Honest limits" says why and what a Windows version would need).

## 2. Install the plugin

Try the Claude Code command line first:

1. `claude plugin marketplace add joebenscoter86/youtube-learner`
2. `claude plugin install youtube-learner@youtube-learner`

If both succeed, the plugin's folder is `~/.claude/plugins/marketplaces/youtube-learner`.

If the `claude` command is not found or refuses, install it through the settings file instead:

1. Clone the plugin so you can read it now: `git clone --depth 1 https://github.com/joebenscoter86/youtube-learner ~/.youtube-learner/plugin` (if `git` is missing, macOS offers to install the Command Line Tools: tell the person to click Install in the window that appears, wait for it, then try again).
2. In `~/.claude/settings.json` (create it as `{}` if it does not exist), add `"youtube-learner": {"source": {"source": "github", "repo": "joebenscoter86/youtube-learner"}}` inside `"extraKnownMarketplaces"` and `"youtube-learner@youtube-learner": true` inside `"enabledPlugins"`, creating those keys if needed and keeping everything else in the file exactly as it was. Read the file back and check it is valid JSON.
3. The plugin's folder for now is `~/.youtube-learner/plugin`. Claude Code installs the plugin properly the next time it starts.

## 3. Set up the Mac

Read `skills/setup/SKILL.md` in the plugin's folder and follow it exactly. Wherever it says `${CLAUDE_PLUGIN_ROOT}` or `ROOT`, use the plugin's folder from step 2.

## 4. Finish

Tell the person, in plain words:

- it is set up;
- quit Claude Code and open it again once, so it loads the learner;
- then paste any YouTube tutorial link and say "learn this";
- the honest limits: Mac only, English videos, a few videos a night (YouTube may ask to confirm you are not a robot if you download many, and the learner stops politely when it does), and each video takes a while and some disk space, which Claude can free afterwards.
