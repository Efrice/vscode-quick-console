import * as vs from "vscode"
import {
  getLineText,
  getStartSpace,
  isStartWithCommentConsole,
  isStartWithConsole,
} from "../../utils"

interface LogLine {
  i: number
  start: number
}

export function toggle(editor: vs.TextEditor) {
  const { logsLines, commentLogsLines } = getLogsLines(editor)

  if (logsLines.length > commentLogsLines.length) {
    toggleUp(logsLines, editor)
  } else {
    toggleDown(commentLogsLines, editor)
  }
}

function toggleUp(logsLines: LogLine[], editor: vs.TextEditor) {
  if (logsLines.length > 0) {
    editor.edit((editBuilder) => {
      logsLines.forEach((item) => {
        const logPosition = new vs.Position(item.i, item.start)
        editBuilder.insert(logPosition, "// ")
      })
    })
  }
}

function toggleDown(commentLogsLines: LogLine[], editor: vs.TextEditor) {
  if (commentLogsLines.length > 0) {
    editor.edit((editBuilder) => {
      commentLogsLines.forEach((item) => {
        const selection = new vs.Selection(
          new vs.Position(item.i, item.start),
          new vs.Position(item.i, item.start + 2)
        )
        editBuilder.replace(selection, "")
      })
    })
  }
}

function getLogsLines(editor: vs.TextEditor): {
  logsLines: LogLine[]
  commentLogsLines: LogLine[]
} {
  const document = editor.document
  const totalLines = document.lineCount
  const logsLines: LogLine[] = []
  const commentLogsLines: LogLine[] = []
  for (let i = 0; i < totalLines; i++) {
    const line = getLineText(document, i)
    if (isStartWithConsole(line)) {
      getWholeConsole(logsLines, i, document)
    } else if (isStartWithCommentConsole(line)) {
      getWholeConsole(commentLogsLines, i, document)
    }
  }
  return { logsLines, commentLogsLines }
}

function getWholeConsole(
  lines: LogLine[],
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
  const start = getStartSpace(lineText).length
  lines.push({
    i: line,
    start,
  })
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
    const start = getStartSpace(lineText).length
    lines.push({
      i: line,
      start,
    })
  }
}
