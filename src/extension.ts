import * as vs from "vscode"
import { createConsoleLog, clearConsoleLog } from "./core"

export function activate(context: vs.ExtensionContext) {
  const createCommandId = "quickConsole.createConsoleLog"
  const clearCommandId = "quickConsole.clearConsoleLog"

  const create = vs.commands.registerCommand(createCommandId, createConsoleLog)
  const clear = vs.commands.registerCommand(clearCommandId, clearConsoleLog)

  context.subscriptions.push(create, clear)
}
