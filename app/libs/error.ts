export class ActionError extends Error {
  detail: { title: string; message: string }

  constructor(message: string, detail: { title: string; message: string }) {
    super(message)
    this.name = "ActionError"
    this.detail = detail
  }
}

export class BatchActionError extends Error {
  details: { title: string; message: string }[]

  constructor(message: string, details: { title: string; message: string }[]) {
    super(message)
    this.name = "BatchActionError"
    this.details = details
  }
}
