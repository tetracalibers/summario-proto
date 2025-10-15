import { getCallSites } from "node:util"

export const debugLog = (...args: any[]) => {
  if (!import.meta.env.DEV) return

  // debugLog() の呼び出し元を取得
  const [_, site] = getCallSites()
  const fn = site?.functionName || "anonymous"

  console.log(`[${fn}]`, ...args)
}
