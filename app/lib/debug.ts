import { getCallSites } from "node:util"

export const debugLog = (...args: any[]) => {
  if (!import.meta.env.DEV) return

  // 呼び出し元フレームを1件だけ取得（ソースマップ対応も可）
  const [site] = getCallSites(1, { sourceMap: true })
  const fn = site?.functionName || "anonymous"

  console.log(`[${fn}]`, ...args)
}
