export default class ProffyError extends Error {
  constructor(message: string) {
    super(message)
    this.message = message
  }
}
ProffyError.prototype.name = 'Custom Error'
