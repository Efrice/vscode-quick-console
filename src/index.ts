import * as vs from 'vscode'

interface LogInfo {
  logs: string
  insertLine: number
  cursorPosition: {
    line: number
    character: number
  }
}

export function getLogInfo(editor: vs.TextEditor): LogInfo{
  const { line } = editor.selection.active

  const { logs, cursorPosition } = getLogsAndCursor(editor)
  const insertLine = getInsertLine(line, editor.document)

  return {
    logs,
    insertLine,
    cursorPosition
  }
}

function getLogsAndCursor(editor: vs.TextEditor){
  const { line, character } = editor.selection.active
  const selectedText = editor.document.getText(editor.selection)
  const lineText = editor.document.lineAt(line).text
  const isFn = isFunction(lineText)
  const words = getWordFromSelected(selectedText, isFn) || getWord(lineText, character)
  let logs = ''
  const cursorPosition = {
    line: 0,
    character: 0
  }

  if(typeof words === 'string' && words.trim() === ''){
    return {
      logs,
      cursorPosition
    }
  }
  
  if(typeof words === 'string'){
    logs += generateLog(words, getStartSpace(lineText, isFn))

    cursorPosition.line = line + 1
    cursorPosition.character = logs.length - 1
  }else {
    const space = getStartSpace(lineText, isFn)
    for(let i = 0; i < words.length - 1; i++){
      logs += generateLog(words[i], space)
    }
    const lastLog = generateLog(words[words.length - 1], space)
    logs += lastLog

    cursorPosition.line = line + words.length
    cursorPosition.character = lastLog.length - 1
  }
  
  return { 
    logs,
    cursorPosition
  }
}

function getInsertLine(line: number, document: vs.TextDocument): number{
  const isFn = isFunction(document.lineAt(line).text)
  let insertLine = line
  if(isFn){
    insertLine = getLineOfOpenBrace(line, document)
  }

  return insertLine + 1
}

function isFunction(lineText: string): boolean {
  return lineText.includes('function') || lineText.includes('=>')
}

function getWordFromSelected(selectedText: string, isFn: boolean = false): string | string[] {
  if (!selectedText.includes(',')) {
    return selectedText
  } else if (!selectedText.includes(':')) {
    return selectedText.split(',').map(item => item.trim())
  } else if (selectedText.includes(':')) {
    const selectedTextArray = selectedText.split(',')
    const args = []
    for (let i = 0; i < selectedTextArray.length; i++) {
      const [ a, b ] = selectedTextArray[i].split(':')
      const arg = isFn ? a.trim() : b.trim()
      args.push(arg)
    }
    return args
  }
  return ''
}

function getWord(lineText: string, character: number): string {
  const keyWords = ['const', 'let', 'var', 'function', 'class', 'typeof', 'export']
  const words = lineText.split('')
  const wordReg = /[a-zA-Z0-9_\.]/
  const isWord = wordReg.test(words[character])
  const target = isWord ? [words[character]] : []
  let left = character - 1, right = character + 1
  while (left >= 0 && wordReg.test(words[left])) {
    target.unshift(words[left])
    left--
  }
  while (isWord && right < words.length && wordReg.test(words[right])) {
    target.push(words[right])
    right++
  }
  const targetStr = target.join('')
  if (keyWords.includes(targetStr)) {
    return ''
  }
  return targetStr
}

function generateLog(log: string, space: string): string {
  return`${space}console.log('${log}:', ${log})\n`
}

function getStartSpace(lineText: string, isFn: boolean = false): string {
  let spaceNumber = 0, tabNumber = 0
  for (let i = 0; i < lineText.length; i++) {
    if (lineText[i] === ' ') {
      spaceNumber++
    } else if (lineText[i] === '\t') {
      tabNumber++
    } else {
      break
    }
  }

  tabNumber += isFn ? 1 : 0
  return ' '.repeat(spaceNumber) + '\t'.repeat(tabNumber)
}

function getLineOfOpenBrace(line: number, document: vs.TextDocument): number {
  let position = line
  let lineText = document.lineAt(position).text
  while (!lineText.includes('{')) {
    position++
    lineText = document.lineAt(position).text
  }
  return position
}
