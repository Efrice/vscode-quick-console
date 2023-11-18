<p align="center">
  <img src="./public/icon.png" height="150">
</p>

<h1 align="center">
Quick Console
</h1>

<p align="center">
Quick generate console.log for variables with selection or not anywhere.
</p>

## Features

|          origin          |     |          generate          |
| :----------------------: | :-: | :------------------------: |
| ![](./public/origin.png) | =>  | ![](./public/generate.png) |

- 🧂 It can be used anywhere.
- 🍭 Single variable without selection.
- 🌭 Multiple params of function with selection.
- 🌭 Multiple continuous variables like deconstruct assignment with selection.
- 🍖 Clear all console.log in the active file.
- 🍖 Toggle all console.log's state of comment in the active file.
- 🛠 Improve the development experience with console variables in an object.
- 🛠 Option for console log variables name.

## Usage

Without Selection

- Move the cursor near in variable.
- Press `Cmd + Shift + L` (Mac) or `Ctrl + Shift + L` (Windows).
- Next line will be:<br />
  console.log('variable:', variable)

With Selection

- Selected continuous variables or params of function.
- Press `Cmd + Shift + L` (Mac) or `Ctrl + Shift + L` (Windows).
- Next line will be: <br />
  console.log('variable1:', variable1)<br />
  console.log('variable2:', variable2)

Clear console.logs

- Press `Cmd + Shift + K` (Mac) or `Ctrl + Shift + K` (Windows).

## Options

### consoleInObject

- Type: `Boolean`
- Default: `false`

Console log variables in an object.

### consoleVariablesName

- Type: `Boolean`
- Default: `true`

Console log variables name.

## Vim keyBindings Setting

```json
"vim.visualModeKeyBindingsNonRecursive": [
  {
    "before": ["<leader>", "l"],
    "commands": [
      "quickConsole.createConsoleLog",
      "extension.vim_ctrl+["
    ]
  },
  {
    "before": ["<leader>", "k"],
    "commands": ["quickConsole.clearConsoleLog"]
  },
  {
    "before": ["<leader>", "k"],
    "commands": ["quickConsole.commentConsoleLog"]
  }
],
"vim.normalModeKeyBindingsNonRecursive": [
  {
    "before": ["<leader>", "l"],
    "commands": ["quickConsole.createConsoleLog"]
  },
  {
    "before": ["<leader>", "k"],
    "commands": ["quickConsole.clearConsoleLog"]
  },
  {
    "before": ["<leader>", "k"],
    "commands": ["quickConsole.commentConsoleLog"]
  }
]
```

✨ Happy hacking!

## License

MIT
