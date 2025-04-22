import { Request, Response } from "express";
import { createChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../utils/auth.js";

export default async function handlerCreateChirp(req: Request, res: Response) {
  type parameters = { body: string };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("missing jwt secret");
  }

  try {
    const token = getBearerToken(req);
    console.log("token", JSON.stringify(token, null, 2));
    const userId = validateJWT(token, secret);
    const params: parameters = req.body;
    console.log("params", JSON.stringify(params, null, 2));
    const chirp = await createChirp({ userId, body: params.body });
    res.status(201).json({ ...chirp });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
}
