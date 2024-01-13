import * as vs from "vscode"
import { getLineText, isStartWithConsole } from "../../utils"

export function clear(editor: vs.TextEditor) {
  const logsLines = getLogsLines(editor)

  clearUp(logsLines, editor)
}

function clearUp(logsLines: number[][], editor: vs.TextEditor) {
  if (logsLines.length > 0) {
    editor.edit((editBuilder) => {
      logsLines.forEach((item) => {
        const selection = new vs.Selection(
          new vs.Position(item[0], 0),
          new vs.Position(item[item.length - 1] + 1, 0)
        )
        editBuilder.delete(selection)
      })
    })
  }
}

function getLogsLines(editor: vs.TextEditor): number[][] {
  const document = editor.document
  const totalLines = document.lineCount
  const logsLines: number[][] = []
  let cell: number[] = []
  for (let i = 0; i < totalLines; i++) {
    if (isStartWithConsole(getLineText(document, i))) {
      if (isNextLineConsole(cell, i)) {
        getWholeConsole(cell, i, document)
      } else {
        cell.length > 0 && logsLines.push(cell)
        cell = []
        getWholeConsole(cell, i, document)
      }
    }
  }
  if (cell.length > 0) {
    logsLines.push(cell)
  }
  console.log({ push: logsLines })
  return logsLines
}

function isNextLineConsole(cell: number[], line: number) {
  return cell.length > 0 && line === cell[cell.length - 1] + 1
}

function getWholeConsole(
  cell: number[],
  line: number,
  document: vs.TextDocument
) {
  const roundBracketsStack = []
  const lineText = getLineText(document, line)
  for (let i = 0; i < lineText.length; i++) {
    if (lineText[i] === "(") {
      roundBracketsStack.push(i)
    } else if (lineText[i] === ")") {
      roundBracketsStack.pop()
    }
  }
  cell.push(line)
  while (roundBracketsStack.length > 0) {
    line++
    const lineText = getLineText(document, line)
    for (let i = 0; i < lineText.length; i++) {
      if (lineText[i] === "(") {
        roundBracketsStack.push(i)
      } else if (lineText[i] === ")") {
        roundBracketsStack.pop()
      }
    }
    cell.push(line)
  }
}
