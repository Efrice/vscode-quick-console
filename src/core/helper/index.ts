import { LogInfo } from "../create"

export function createLogInfo(): LogInfo & { push: (log: string) => void } {
  const logInfo = {
    logs: "",
    insertLine: 0,
    isReplaceLine: false,
    cursorPosition: {
      line: 0,
      character: 1,
    },
    push(log: string) {
      logInfo.logs += log
    },
  }
  return logInfo
}
