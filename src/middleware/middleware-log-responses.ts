import { Request, Response, NextFunction } from "express";

export default function middlewareLogResponses(req: Request, res: Response, next: NextFunction): void {
  res.on("finish", () => {
    const statusCode = res.statusCode;
    if (statusCode > 299) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
    }
  });
  next();
}