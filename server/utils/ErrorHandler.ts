/**
 * Custom error handler class extending the Error class to manage and standardize error handling.
 */
class ErrorHandler extends Error {
  /**
   * HTTP status code associated with the error.
   */
  statusCode: Number;

  /**
   * Constructor for creating instances of the ErrorHandler class.
   * @param message - The error message or description.
   * @param statusCode - The HTTP status code to be set for the error.
   */
  constructor(message: any, statusCode: Number) {
    super(message); // Call the parent class constructor with the provided message.
    this.statusCode = statusCode; // Assign the statusCode property with the provided status code.

    // Capture and store the stack trace for better error tracking and debugging.
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler; // Export the ErrorHandler class for external use.
