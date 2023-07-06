import * as vs from 'vscode'
import { getLogInfo } from './index'

export function activate(context: vs.ExtensionContext) {
	const commandId = 'quickConsole.createConsoleLog'
	
	let disposable = vs.commands.registerCommand(commandId, () => {
		const editor = vs.window.activeTextEditor
    if (!editor) {
      return
    }
		
		const { logs, insertLine } = getLogInfo(editor)

		if(logs){
			editor.insertSnippet(
				new vs.SnippetString(logs),
				new vs.Position(insertLine, 0)
			)
		}
	})

	context.subscriptions.push(disposable)
}
