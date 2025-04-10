import { Request, Response } from "express";
import { getAllChirps, getChirpById } from "../db/queries/chirps.js";

export default async function handlerGetChirp(req: Request, res: Response) {
  const id = req.params["id"];

  const chirp = await getChirpById(id);
  if (!chirp) {
    res.status(404).json({ error: `No chirp matching id ${id}` })
    return;
  }

  res.status(200).json({ ...chirp });
}