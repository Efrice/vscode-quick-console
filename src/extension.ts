import * as vs from 'vscode'
import { getLogInfo } from './index'

export function activate(context: vs.ExtensionContext) {
  const commandId = 'quickConsole.createConsoleLog'

  let disposable = vs.commands.registerCommand(commandId, () => {
    const editor = vs.window.activeTextEditor
    if (!editor) {
      return
    }

    const { logs, insertLine, cursorPosition } = getLogInfo(editor)

    if(logs){
      editor.edit((editBuilder) => editBuilder.insert(new vs.Position(insertLine, 0), logs))

      const { line, character } = cursorPosition
      editor.selection = new vs.Selection(
        new vs.Position(line, character),
        new vs.Position(line, character)
      )
    }
  })

  context.subscriptions.push(disposable)
}
