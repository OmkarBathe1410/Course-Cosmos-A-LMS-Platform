"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatchAsyncError = void 0;
/**
 * Middleware function to catch asynchronous errors and pass them to the error handling middleware.
 * @param theFunc - The asynchronous function to be executed.
 * @returns A function that handles asynchronous errors and passes them to the next middleware.
 */
const CatchAsyncError = (theFunc) => (req, res, next) => {
    Promise.resolve(theFunc(req, res, next)).catch(next); // Execute the asynchronous function and catch any errors
};
exports.CatchAsyncError = CatchAsyncError;
