export class AppError extends Error {
  public statusCode: number;
  public details?: any;
  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    // This line is needed to keep the proper stack trace in TypeScript
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
