import * as vs from 'vscode'
import { isObject, getLineText } from '../../utils'
import { resolveSelection } from './resolveSelection'
import { resolveDefault } from './resolveDefault'
import { getInsertLine } from './getInsertLine'

export interface LogInfo {
  logs: string
  insertLine: number
  cursorPosition: {
    line: number
    character: number
  }
}

let init = false
export function create(editor: vs.TextEditor){
  const { logs, insertLine, cursorPosition } = getLogInfo(editor)

  if(logs){
    editor.edit((editBuilder) => editBuilder.insert(new vs.Position(insertLine, 0), logs)).then(() => {
      setCursorPosition(editor, cursorPosition)
    })
    if (!init) {
      setCursorPosition(editor, cursorPosition)
      init = true
    }
  }
}

function getLogInfo(editor: vs.TextEditor): LogInfo {
  const { line } = editor.selection.active

  const { logs, cursorPosition } = getLogsAndCursor(editor)
  const insertLine = getInsertLine(editor.document, line)

  if(isObject(getLineText(editor.document, line))){
    cursorPosition.line = insertLine
  }

  return {
    logs,
    insertLine,
    cursorPosition
  }
}

function getLogsAndCursor(editor: vs.TextEditor): Omit<LogInfo, 'insertLine'> {
  const selectedText = editor.document.getText(editor.selection)
  const { logs, cursorPosition } = selectedText.length > 0 ? resolveSelection(editor) : resolveDefault(editor)

  return { 
    logs,
    cursorPosition
  }
}

function setCursorPosition( editor: vs.TextEditor, cursorPosition: { line: number; character: number }): vs.Selection{
  const { line, character } = cursorPosition
  const position = new vs.Position(line, character)

  editor.selection = new vs.Selection(position, position)
  return editor.selection
}
