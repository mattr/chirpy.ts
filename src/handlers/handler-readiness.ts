import { Request, Response } from "express";

export default async function handlerReadiness(req: Request, res: Response) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK")
}

