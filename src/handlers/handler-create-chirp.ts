import { Request, Response } from "express";
import { createChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../utils/auth.js";

export default async function handlerCreateChirp(req: Request, res: Response) {
  type parameters = { body: string };

  try {
    const token = getBearerToken(req);
    const userId = validateJWT(token, process.env.JWT_SECRET ?? "");
    const params: parameters = req.body;
    const chirp = await createChirp({ userId, body: params.body });
    res.status(201).json({ ...chirp });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
