import * as vs from "vscode"
import { createConsoleLog, clearConsoleLog, toggleConsoleLog } from "./core"

export function activate(context: vs.ExtensionContext) {
  const createCommandId = "quickConsole.createConsoleLog"
  const clearCommandId = "quickConsole.clearConsoleLog"
  const toggleCommandId = "quickConsole.toggleConsoleLog"

  const create = vs.commands.registerCommand(createCommandId, createConsoleLog)
  const clear = vs.commands.registerCommand(clearCommandId, clearConsoleLog)
  const toggle = vs.commands.registerCommand(toggleCommandId, toggleConsoleLog)

  context.subscriptions.push(create, clear, toggle)
}
