import { NextFunction, Request, Response } from "express";

/**
 * Middleware function to catch asynchronous errors and pass them to the error handling middleware.
 * @param theFunc - The asynchronous function to be executed.
 * @returns A function that handles asynchronous errors and passes them to the next middleware.
 */
export const CatchAsyncError =
  (theFunc: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(theFunc(req, res, next)).catch(next); // Execute the asynchronous function and catch any errors
  };
