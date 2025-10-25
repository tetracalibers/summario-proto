export const testLog = (label: string, ...args: any[]) => {
  if (import.meta.env.MODE !== "test") return
  console.log(`[${label}]:`, ...args)
}
