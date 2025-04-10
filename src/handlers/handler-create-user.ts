import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";

export default async function handlerCreateUser(req: Request, res: Response) {
  type parameters = { email: string };

  try {
    const params: parameters = req.body;
    const user = await createUser({ email: params.email });
    res.status(201).json({ ...user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}