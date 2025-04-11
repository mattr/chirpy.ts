import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { NewUser } from "../schema.js";
import { hashPassword } from "../utils/auth.js";

export default async function handlerCreateUser(req: Request, res: Response) {
  type parameters = { email: string, password: string };

  try {
    const params: parameters = req.body;
    console.log(params);
    const hashedPassword = hashPassword(params.password);
    const user = await createUser({ email: params.email, hashedPassword });
    res.status(201).json({ ...user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}