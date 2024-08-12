# Sublime Merge ✕ VS Code

[![Version](https://img.shields.io/visual-studio-marketplace/v/ajitid.sublime-merge-x.svg?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=ajitid.sublime-merge-x)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/ajitid.sublime-merge-x.svg?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=ajitid.sublime-merge-x)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/ajitid.sublime-merge-x.svg?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=ajitid.sublime-merge-x)
[![Open VSX Downloads](https://img.shields.io/open-vsx/dt/ajitid/sublime-merge-x.svg?color=green&label=Open%20VSX&style=for-the-badge)](https://open-vsx.org/extension/ajitid/sublime-merge-x)

Launch contextual aware Sublime Merge commands from VS Code.

## Features

You can launch these commands from command palette:

- View File History
- View Line History
- Blame Line
- Open Repository

## Installation

```sh
ext install ajitid.sublime-merge-x
```

## Requirements

Ensure the `smerge` command is in your `$PATH`.

Details can be [found here](https://www.sublimemerge.com/docs/command_line)

## Settings

### `sublime-merge-x.path`

Path to Sublime Merge (smerge) command. If not set, the extension will check your `$PATH` instead to find it.

## Notes

You can make "Open in Editor…" in Sublime Merge to open VS Code. To do that, first open your terminal and run `code -v`. If it prints anything, great! Otherwise, open command palette using ctrl+shift+p (or cmd+shift+p on a Mac) and search for "Shell Command: Install 'code' command in PATH" and run it.

Then, open Sublime Merge and Preferences › Edit Settings… and type in:

```json
{
  "editor_path": "code",
  "editor_argument_format": "--goto ${file}:${line}:${col}",
  "editor_wait_args": "--wait"
}
```

"Open in Editor…" will open VS Code now.

## Thanks

- [Amit Dhamu](https://github.com/adhamu/history-in-sublime-merge) for creating the original extension
