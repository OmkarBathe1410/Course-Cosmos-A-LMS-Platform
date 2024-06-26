"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Custom error handler class extending the Error class to manage and standardize error handling.
 */
class ErrorHandler extends Error {
    /**
     * Constructor for creating instances of the ErrorHandler class.
     * @param message - The error message or description.
     * @param statusCode - The HTTP status code to be set for the error.
     */
    constructor(message, statusCode) {
        super(message); // Call the parent class constructor with the provided message.
        this.statusCode = statusCode; // Assign the statusCode property with the provided status code.
        // Capture and store the stack trace for better error tracking and debugging.
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = ErrorHandler; // Export the ErrorHandler class for external use.
