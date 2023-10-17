import * as vs from "vscode"
import { getLineText, isFunction, isObject, isVariable } from "../../utils"

export function getInsertLine(document: vs.TextDocument, line: number): number {
  const lineText = getLineText(document, line)
  let insertLine = line
  if (isFunction(lineText)) {
    insertLine = getLineOfFunctionOpenBrace(document, line)
  } else if (isObject(lineText)) {
    insertLine = getLineOfObjectCloseBrace(document, line)
  }

  return insertLine + 1
}

function getLineOfFunctionOpenBrace(
  document: vs.TextDocument,
  line: number
): number {
  let openLine = line
  let lineText = getLineText(document, openLine).replace(/\s/g, "")
  if (lineText.includes("=>") && !lineText.includes("=>{")) {
    return line
  }
  while (!lineText.includes("{")) {
    openLine++
    lineText = getLineText(document, openLine)
  }
  return openLine
}

let objectOpenBraceStack: number[] = []
export function getLineOfObjectOpenBrace(
  document: vs.TextDocument,
  line: number
): number {
  let openLine = line
  let lineText = getLineText(document, openLine, true)
  while (!lineText.includes("={")) {
    if (lineText.includes("{")) {
      objectOpenBraceStack.push(openLine)
    }
    openLine--
    lineText = getLineText(document, openLine, true)
  }
  objectOpenBraceStack.push(openLine)
  return openLine
}

function getLineOfObjectCloseBrace(
  document: vs.TextDocument,
  line: number
): number {
  let closeLine = line
  let lineText = getLineText(document, closeLine)

  if (lineText.includes("}")) {
    objectOpenBraceStack.pop()
  }
  while (objectOpenBraceStack.length > 0) {
    closeLine++
    lineText = getLineText(document, closeLine)
    if (lineText.includes("{")) {
      objectOpenBraceStack.push(line)
    }
    if (lineText.includes("}")) {
      objectOpenBraceStack.pop()
    }
  }
  return closeLine
}
