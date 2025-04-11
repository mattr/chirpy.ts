import { Request, Response } from "express";
import { GetUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash } from "../utils/auth.js";

export default async function handlerLogin(req: Request, res: Response) {
  type parameters = { email: string, password: string };

  try {
    const { email, password }: parameters = req.body;
    const user = await GetUserByEmail(email)
    // @ts-ignore
    if (checkPasswordHash(password, user.hashedPassword)) {
      res.status(200).json({ ...user });
    } else {
      res.status(401).json({ error: "invalid email or password" });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "incorrect email or password" });
  }

}