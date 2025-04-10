import { Request, Response } from "express";
import { createChirp } from "../db/queries/chirps.js";

export default async function handlerCreateChirp(req: Request, res: Response) {
  type parameters = { userId: string, body: string };

  try {
    const params: parameters = req.body;
    const chirp = await createChirp({ ...params });
    res.status(201).json({ ...chirp });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}