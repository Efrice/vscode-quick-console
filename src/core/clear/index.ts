import * as vs from 'vscode'
import { getLineText } from '../../utils'

export function clear(editor: vs.TextEditor){
  const logsLines = getLogsLines(editor)

  clearUp(logsLines, editor)
}

function clearUp(logsLines: number[][], editor: vs.TextEditor) {
  if (logsLines.length > 0) {
    editor.edit((editBuilder) => {
      logsLines.forEach(item => {
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
    if (isStartWithConsole(document, i)) {
      if (isNextLineConsole(cell, i)) {
        cell.push(i)
      } else {
        cell.length > 0 && logsLines.push(cell)
        cell = []
        cell.push(i)
      }
    }
  }
  if (cell.length > 0) {
    logsLines.push(cell)
  }
  return logsLines
}

function isNextLineConsole(cell: number[], line: number) {
  return cell.length > 0 && line === cell[cell.length - 1] + 1
}

function isStartWithConsole(document: vs.TextDocument, line: number) {
  return getLineText(document, line).trim().startsWith('console.log(')
}
