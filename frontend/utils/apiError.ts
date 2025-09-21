export class ApiError extends Error {
  public readonly backendError: {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
  };

  constructor(message: string, backendError: {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
  }) {
    super(message);
    this.name = 'ApiError';
    this.backendError = backendError;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
