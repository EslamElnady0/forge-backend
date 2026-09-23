export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // This line is needed to keep the proper stack trace in TypeScript
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
