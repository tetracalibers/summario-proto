export class ActionError extends Error {
  detail: { target?: string; message: string }

  constructor(message: string, detail: { target?: string; message: string }) {
    super(message)
    this.name = "ActionError"
    this.detail = detail
  }
}

export class BatchActionError extends Error {
  details: { target?: string; message: string }[]

  constructor(message: string, details: { target?: string; message: string }[]) {
    super(message)
    this.name = "BatchActionError"
    this.details = details
  }
}
