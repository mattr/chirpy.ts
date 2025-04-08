import { NextFunction, Request, Response } from "express";

export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.log(err);
  res.status(500).json({ error: "Something went wrong on our end" });
}