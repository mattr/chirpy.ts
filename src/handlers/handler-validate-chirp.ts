import { Request, Response } from "express";
import sanitizeChirp from "../utils/sanitize-chirp.js";

export default async function handlerValidateChirp(req: Request, res: Response) {
  type parameters = { body: string };
  const MAX_CHIRP_LENGTH = 140;

  const params: parameters = req.body;

  if (params.body.length > MAX_CHIRP_LENGTH) {
    throw new Error("Chirp is too long");
  }

  res.status(200).json({ cleanedBody: sanitizeChirp(params.body) });
}