import * as vs from 'vscode'

interface LogInfo {
	logs: string
	insertLine: number
}

export function getLogInfo(editor: vs.TextEditor): LogInfo {
	const { line, character } = editor.selection.active
	const lineText = editor.document.lineAt(line).text
	const selectedText = editor.document.getText(editor.selection)
		
	const logs = generateLogs(selectedText, lineText, character)
	const insertLine = getInsertLine(line, editor.document)

	return {
		logs,
		insertLine
	}
}

function generateLogs(selectedText: string, lineText: string, character: number): string {
	const isFn = isFunction(lineText)
	const words = getWordFromSelected(selectedText) || getWord(lineText, character)
	if(typeof words === 'string' && words.trim() === ''){
		return ''
	}
	let logs = '$1'
	if(typeof words === 'string'){
		logs += generateLog(words, getStartSpaceNumber(lineText), isFn)
	}else {
		const spaceNumber = getStartSpaceNumber(lineText)
		for(let i = 0; i < words.length; i++){
			logs += generateLog(words[i], spaceNumber, isFn)
		}
	}
  return logs
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
	if (lineText.includes('function') || lineText.includes('=>')) {
		return true
	}
	return false
}

function getWordFromSelected(selectedText: string): string | string[] {
	if (!selectedText.includes(',')) {
		return selectedText
	} else if (!selectedText.includes(':')) {
		return selectedText.split(',').map(item => item.trim())
	} else if (selectedText.includes(':')) {
		const selectedTextArray = selectedText.split(',')
		const args = []
		for (let i = 0; i < selectedTextArray.length; i++) {
			const arg: string = selectedTextArray[i].split(':')[0].trim()
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

function generateLog(log: string, spaceNumber: number, isFn: boolean): string {
	const space = ' '.repeat(spaceNumber) + (isFn ? '\t' : '')
	return `${space}console.log('${log}:', ${log})\n`
}

function getStartSpaceNumber(lineText: string): number {
	let spaceNumber = 0
	for (let i = 0; i < lineText.length; i++) {
		if (lineText[i] === ' ') {
			spaceNumber++
		} else {
			break
		}
	}
	return spaceNumber
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
