import { Request, Response } from "express";
import sanitizeChirp from "../utils/sanitize-chirp.js";
import BadRequestError from "../errors/bad-request-error.js";

export default async function handlerValidateChirp(req: Request, res: Response) {
  type parameters = { body: string };
  const MAX_CHIRP_LENGTH = 140;

  const params: parameters = req.body;

  if (params.body.length > MAX_CHIRP_LENGTH) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  res.status(200).json({ cleanedBody: sanitizeChirp(params.body) });
}