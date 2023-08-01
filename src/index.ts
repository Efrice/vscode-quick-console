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

  if(isObject(editor.document.lineAt(line).text)){
    cursorPosition.line = insertLine
  }

  return {
    logs,
    insertLine,
    cursorPosition
  }
}

export function moveCursor(cursorPosition: { line: number; character: number }, editor: vs.TextEditor) {
  const { line, character } = cursorPosition
  editor.selection = new vs.Selection(
    new vs.Position(line, character),
    new vs.Position(line, character)
  )
  return editor.selection
}

export function getLogsLines(editor: vs.TextEditor): number[][] {
  const document = editor.document
  const totalLines = document.lineCount
  const logsLines: number[][] = []
  let cell: number[] = []
  for (let i = 0; i < totalLines; i++) {
    if (document.lineAt(i).text.trim().startsWith('console.log(')) {
      if (cell.length > 0 && i === cell[cell.length - 1] + 1) {
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

function getLogsAndCursor(editor: vs.TextEditor){
  const document = editor.document
  const { line, character } = editor.selection.active
  const selectedText = document.getText(editor.selection)
  const lineText = document.lineAt(line).text
  const words = getWordFromSelected(selectedText, isFunction(lineText)) || getWord(lineText, character)
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
    const text = isObject(lineText) ? getTextByLine(getLineOfObjcetOpenBrace(line, document), document) : lineText
    logs += generateLog(words, getStartSpace(text))

    cursorPosition.line = line + 1
    cursorPosition.character = logs.length - 1
  }else {
    const space = getStartSpace(lineText)
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
  const lineText = getTextByLine(line, document)
  let insertLine = line
  if(isFunction(lineText)){
    insertLine = getLineOfFunctionOpenBrace(line, document)
  }else if(isObject(lineText)){
    insertLine = getLineOfObjectCloseBrace(line, document)
  }

  return insertLine + 1
}

function isFunction(lineText: string): boolean {
  return lineText.includes('function') || lineText.includes('=>')
}

function isObject(lineText: string): boolean {
  return lineText.replace(/\s/g, '').includes('={') || (!isVariable(lineText) && lineText.includes(':'))
}

function isVariable(lineText: string): boolean {
  return lineText.includes('var') || lineText.includes('let') || lineText.includes('const')
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

function getStartSpace(lineText: string): string {
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

  tabNumber += isFunction(lineText) ? 1 : 0
  return ' '.repeat(spaceNumber) + '\t'.repeat(tabNumber)
}

function getLineOfFunctionOpenBrace(line: number, document: vs.TextDocument): number {
  let position = line
  let lineText = getTextByLine(position, document)
  while (!lineText.includes('{')) {
    position++
    lineText = getTextByLine(position, document)
  }
  return position
}


let objectOpenBraceStack: number[] = []
function getLineOfObjcetOpenBrace(line: number, document: vs.TextDocument): number {
  let position = line
  let lineText = getTextByLine(position, document).replace(/\s/g, '')
  while (!lineText.includes('={')) {
    if(lineText.includes('{')){
      objectOpenBraceStack.push(position)
    }
    position--
    lineText = getTextByLine(position, document).replace(/\s/g, '')
  }
  objectOpenBraceStack.push(position)
  return position
}

function getLineOfObjectCloseBrace(line: number, document: vs.TextDocument): number {
  let position = line
  let lineText = getTextByLine(position, document)

  if(lineText.includes('}')){
    objectOpenBraceStack.pop()
  }
  while (objectOpenBraceStack.length > 0) {
    position++
    lineText = getTextByLine(position, document)
    if(lineText.includes('{')){
      objectOpenBraceStack.push(line)
    }
    if(lineText.includes('}')){
      objectOpenBraceStack.pop()
    }
  }
  return position
}

function getTextByLine(line: number, document: vs.TextDocument): string {
  return document.lineAt(line).text
}
