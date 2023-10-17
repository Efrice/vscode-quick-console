import * as vs from "vscode"
import { LogInfo } from "."
import { createLogInfo } from "../helper"
import {
  getLineText,
  getStartSpace,
  generateLog,
  generateLogInObject,
  isObject,
} from "../../utils"
import { getLineOfObjectOpenBrace } from "./getInsertLine"

export function resolveDefault(
  editor: vs.TextEditor,
  consoleInObject: boolean | undefined
) {
  const logInfo = createLogInfo()
  getLogsAndCursor(editor, logInfo, consoleInObject)

  return logInfo
}

function getLogsAndCursor(
  editor: vs.TextEditor,
  logInfo: LogInfo & { push: (log: string) => void },
  consoleInObject: boolean | undefined
): void {
  const document = editor.document
  const { line, character } = editor.selection.active
  const lineText = getLineText(document, line)
  const word = getWord(lineText, character)
  const { cursorPosition, push } = logInfo
  const text = isObject(lineText)
    ? getLineTextOfObject(document, line)
    : lineText

  push(
    consoleInObject
      ? generateLogInObject([word], getStartSpace(text))
      : generateLog(word, getStartSpace(text))
  )

  cursorPosition.line = line + 1
  cursorPosition.character = logInfo.logs.length - 1
}

function getLineTextOfObject(document: vs.TextDocument, line: number) {
  return getLineText(document, getLineOfObjectOpenBrace(document, line))
}

function getWord(lineText: string, character: number): string {
  const keyWords = [
    "const",
    "let",
    "var",
    "function",
    "class",
    "typeof",
    "import",
    "export",
  ]
  const words = lineText.split("")
  const target = isLetter(words[character]) ? [words[character]] : []
  let left = character - 1,
    right = character + 1
  while (left >= 0 && isLetter(words[left])) {
    target.unshift(words[left])
    left--
  }
  while (
    isLetter(words[character]) &&
    right < words.length &&
    isLetter(words[right])
  ) {
    target.push(words[right])
    right++
  }
  const targetStr = target.join("")
  if (keyWords.includes(targetStr)) {
    return ""
  }
  return targetStr
}

function isLetter(char: string) {
  return /[a-zA-Z0-9_\.]/.test(char)
}
