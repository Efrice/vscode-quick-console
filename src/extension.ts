import * as vs from 'vscode'
import { moveCursor, getLogInfo, getLogsLines } from './index'

export function activate(context: vs.ExtensionContext) {
  const createCommandId = 'quickConsole.createConsoleLog'
  const clearCommandId = 'quickConsole.clearConsoleLog'

  let init = false
  const disposable = vs.commands.registerCommand(createCommandId, () => {
    const editor = vs.window.activeTextEditor
    if (!editor) {
      return
    }

    const { logs, insertLine, cursorPosition } = getLogInfo(editor)

    if(logs){
      editor.edit((editBuilder) => editBuilder.insert(new vs.Position(insertLine, 0), logs)).then(() =>{
        moveCursor(cursorPosition, editor)
      })
      if(!init){
        moveCursor(cursorPosition, editor)
        init = true
      }
    }
  })

  const clearable = vs.commands.registerCommand(clearCommandId, () => {
    const editor = vs.window.activeTextEditor
    if (!editor) {
      return
    }

    const logsLines = getLogsLines(editor)

    if(logsLines.length > 0){
      editor.edit((editBuilder) => {
        logsLines.forEach(item => {
          const selection = new vs.Selection(
            new vs.Position(item[0], 0),
            new vs.Position(item[item.length-1] + 1, 0)
          )
          editBuilder.delete(selection);
        })
      })
    }
  })

  context.subscriptions.push(disposable, clearable)
}
