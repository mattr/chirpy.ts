import { NextFunction, Request, Response } from "express";
import BadRequestError from "../errors/bad-request-error.js";
import UnauthorizedError from "../errors/unauthorized-error.js";
import ForbiddenError from "../errors/forbidden-error.js";
import NotFoundError from "../errors/not-found-error.js";

export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.log(err.name, err);
  let error: string;
  let statusCode: number;
  if (err instanceof BadRequestError) {
    error = err.message;
    statusCode = 400;
  } else if (err instanceof UnauthorizedError) {
    error = err.message;
    statusCode = 401;
  } else if (err instanceof ForbiddenError) {
    error = err.message;
    statusCode = 403;
  } else if (err instanceof NotFoundError) {
    error = err.message;
    statusCode = 404;
  } else {
    error = "Something went wrong on our end";
    statusCode = 500;
  }

  console.log(error, statusCode);
  res.status(statusCode).json({ error });
}