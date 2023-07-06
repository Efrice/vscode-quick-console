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

| origin || generate |
|:---:|:---:|:---:|
| ![](./public/origin.png) | => | ![](./public/generate.png) |

- 🧂  It's can be use anywhere.
- 🍭 Single variable without selection.
- 🌭 Multiple params of function with selection.
- 🌭 Multiple continuous variables like deconstruct assignment with selection.

## Usage

Without Selection 
  - Move the cursor near variable.
  - Press `Cmd + Shift + L` (Mac) or `Ctrl + Shift + L` (Windows).
  - Next line will be:<br /> 
    console.log('variable:', variable)

With Selection 
  - Selected continuous variables or params of function.
  - Press `Cmd + Shift + L` (Mac) or `Ctrl + Shift + L` (Windows).
  - Next line will be: <br />
    console.log('variable1:', variable1)<br />
    console.log('variable2:', variable2)

## Vim keyBindings Setting

```json
"vim.visualModeKeyBindingsNonRecursive": [
  {
    "before": ["<leader>", "c", "l"],
    "commands": ["quickConsole.createConsoleLog"]
  }
],
"vim.normalModeKeyBindingsNonRecursive": [
  {
    "before": ["<leader>", "c", "l"],
    "commands": ["quickConsole.createConsoleLog"]
  }
]
```
✨ Happy hacking!

## License

MIT