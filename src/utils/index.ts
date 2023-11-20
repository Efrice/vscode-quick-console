import * as vs from "vscode"

export function isVariable(lineText: string): boolean {
  return (
    lineText.includes("const") ||
    lineText.includes("let") ||
    lineText.includes("var")
  )
}

export function isFunction(lineText: string): boolean {
  return lineText.includes("function") || lineText.includes("=>")
}

export function isObject(lineText: string): boolean {
  return (
    lineText.replace(/\s/g, "").includes("={") ||
    (!isVariable(lineText) && lineText.includes(":") && !isFunction(lineText))
  )
}

export function getLineText(
  document: vs.TextDocument,
  line: number,
  clearSpace = false
): string {
  const text = document.lineAt(line).text
  return clearSpace ? text.replace(/\s/g, "") : text
}

export function getStartSpace(lineText: string): string {
  let spaceNumber = 0,
    tabNumber = 0
  for (let i = 0; i < lineText.length; i++) {
    if (lineText[i] === " ") {
      spaceNumber++
    } else if (lineText[i] === "\t") {
      tabNumber++
    } else {
      break
    }
  }

  tabNumber += isFunction(lineText) ? 1 : 0
  return " ".repeat(spaceNumber) + "\t".repeat(tabNumber)
}

export function generateLog(
  log: string,
  space: string,
  consoleVariablesName: boolean
): string {
  return consoleVariablesName
    ? `${space}console.log('${log}:', ${log})\n`
    : `${space}console.log(${log})\n`
}

export function generateLogInObject(
  logs: string[],
  space: string,
  consoleVariablesName: boolean
): string {
  logs = logs.map((log) => {
    if (log.includes(".")) {
      const properties = log.split(".")
      return `${properties[properties.length - 1]}: ${log} `
    }
    return log
  })
  return consoleVariablesName
    ? `${space}console.log('${logs.join(", ")}:', { ${logs.join(", ")} })\n`
    : `${space}console.log({ ${logs.join(", ")} })\n`
}

export function isStartWithConsole(line: string) {
  return line.trim().startsWith("console.log(")
}

export function isStartWithCommentConsole(line: string) {
  return line.trim().replace(/\s/g, "").startsWith("//console.log(")
}
