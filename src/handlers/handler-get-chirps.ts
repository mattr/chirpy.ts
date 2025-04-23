import { Request, Response } from "express";
import { getAllChirps, getChirpsByUserId } from "../db/queries/chirps.js";
import type { Chirp } from "../schema.js";

export default async function handlerGetChirps(req: Request, res: Response) {
  let authorId = "";
  let authorIdQuery = req.query.authorId;
  if (typeof authorIdQuery === "string") {
    authorId = authorIdQuery.trim();
  }

  let chirps: Chirp[];
  if (authorId) {
    chirps = await getChirpsByUserId(authorId);
  } else {
    chirps = await getAllChirps();
  }

  if (typeof req.query.sort === "string") {
    const sort = req.query.sort.trim().toLowerCase();
    if (sort === "desc") {
      chirps.reverse()
    }
  }

  res.status(200).json(chirps);
}
