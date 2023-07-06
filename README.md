# VS Code Quick Console

Quick generate console.log for variables with selection or not anywhere.


## Features

||||
|--|--|--|
| ![](./public/origin.png) | => | ![](./public/generate.png) |

- 🧂  It's can be use anywhere.
- 🍭 Single variable without selection.
- 🌭 Multiple params of function with selection.

## Usage

### Normal

Without Selection 
  - Move the cursor near variable.
  - Press `Cmd + Shift + L` (Mac) or `Ctrl + Shift + L` (Windows).
  - Next line will be: 
    console.log('variable:', variable)

With Selection 
  - Selected the params of function. 
  - Press `Cmd + Shift + L` (Mac) or `Ctrl + Shift + L` (Windows).
  - Next line will be: 
      console.log('variable1:', variable1)
      console.log('variable2:', variable2)

### Vim keyBindings Setting

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