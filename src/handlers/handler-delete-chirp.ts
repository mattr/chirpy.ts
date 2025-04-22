import type { Request, Response } from "express";
import { getBearerToken, validateJWT } from "../utils/auth.js";
import { deleteChirp, getChirpById } from "../db/queries/chirps.js";

export default async function handlerDeleteChirp(req: Request, res: Response) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("[handlerDeleteChirp] missing jwt secret");
  }

  try {
    const token = getBearerToken(req);
    const userId = validateJWT(token, secret);
    const chirp = await getChirpById(req.params.id);
    if (!chirp) {
      res.status(404).json({ error: "chirp not found" });
      return;
    }
    if (chirp.userId !== userId) {
      res.status(403).json({ error: "not authorized" });
      return;
    }

    const result = await deleteChirp(chirp.id)
    console.log("deleted chirp", JSON.stringify(result, null, 2));
    res.status(204).send();

  } catch (error) {
    console.error(error);
    res.status(401).json({ error });
  }
}
