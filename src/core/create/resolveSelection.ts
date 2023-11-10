import * as vs from "vscode"
import { LogInfo, Options } from "."
import { createLogInfo } from "../helper"
import {
  generateLog,
  generateLogInObject,
  getLineText,
  getStartSpace,
  isFunction,
} from "../../utils"

export function resolveSelection(editor: vs.TextEditor, options: Options): LogInfo {
  const logInfo = createLogInfo()
  getLogsAndCursor(editor, logInfo, options)

  return logInfo
}

function getLogsAndCursor(
  editor: vs.TextEditor,
  logInfo: LogInfo & { push: (log: string) => void },
  options: Options
): void {
  const document = editor.document
  const selectedText = document.getText(editor.selection)
  const { line } = editor.selection.active
  const lineText = getLineText(document, line)
  const words = getWordsFromSelected(selectedText, lineText)
  const { cursorPosition, push } = logInfo
  const { consoleInObject, consoleVariablesName } = options

  const space = getStartSpace(lineText)
  if (consoleInObject) {
    push(generateLogInObject(words, space, consoleVariablesName))
    cursorPosition.line = line + 1
    cursorPosition.character = logInfo.logs.length - 1
  } else {
    for (let i = 0; i < words.length - 1; i++) {
      push(generateLog(words[i], space, consoleVariablesName))
    }
    const lastLog = generateLog(words[words.length - 1], space, consoleVariablesName)
    push(lastLog)

    cursorPosition.line = line + words.length
    cursorPosition.character = lastLog.length - 1
  }
}

function getWordsFromSelected(
  selectedText: string,
  lineText: string
): string[] {
  if (!selectedText.includes(",")) {
    return [selectedText]
  } else if (!selectedText.includes(":")) {
    return selectedText.split(",").map((item) => item.trim())
  } else if (selectedText.includes(":")) {
    const selectedTextArray = selectedText.split(",")
    const args = []
    for (let i = 0; i < selectedTextArray.length; i++) {
      const [a, b] = selectedTextArray[i].split(":")
      const arg = isFunction(lineText) ? a?.trim() : b?.trim() || a?.trim()
      args.push(arg)
    }
    return args
  }
  return []
}
