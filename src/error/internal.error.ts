import ErrorType from '../model/error.type';

class InternalError extends Error {
  public readonly type: ErrorType;

  constructor(message: string, type: ErrorType = ErrorType.INTERNAL) {
    super(message);
    this.type = type;
    Object.setPrototypeOf(this, InternalError.prototype);
  }
}

export default InternalError;
