import { Request, Response } from "express";
import { GetUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT } from "../utils/auth.js";
import { UserResponse } from "src/schema.js";

// 1 hour in ms
const DEFAULT_EXPIRES_IN = 60 * 60 * 1000;

export default async function handlerLogin(req: Request, res: Response) {
  type parameters = { email: string, password: string, expiresInSeconds?: number };

  try {
    const { email, password, expiresInSeconds }: parameters = req.body;
    const user = await GetUserByEmail(email)
    // @ts-ignore
    if (user && checkPasswordHash(password, user.hashedPassword)) {
      const token = makeJWT(user.id, expiresInSeconds ?? DEFAULT_EXPIRES_IN, process.env.JWT_SECRET ?? "");
      res.status(200).json({ ...user as UserResponse, token });
    } else {
      res.status(401).json({ error: "invalid email or password" });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "incorrect email or password" });
  }

}
