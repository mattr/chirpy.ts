import { Request, Response } from "express";
import { getAllChirps } from "../db/queries/chirps.js";

export default async function handlerGetChirps(req: Request, res: Response) {
  const chirps = await getAllChirps();
  res.status(200).json(chirps);
}