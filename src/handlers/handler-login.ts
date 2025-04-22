import { Request, Response } from "express";
import { GetUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "../utils/auth.js";
import { UserResponse } from "src/schema.js";
import { createRefreshToken } from "../db/queries/refresh-tokens.js";

// 1 hour in ms
const DEFAULT_EXPIRES_IN = 60 * 60 * 1000;

export default async function handlerLogin(req: Request, res: Response) {
  type parameters = { email: string, password: string };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("missing jwt secret");
  }

  try {
    const { email, password }: parameters = req.body;
    const user = await GetUserByEmail(email)
    // @ts-ignore
    if (user && checkPasswordHash(password, user.hashedPassword)) {
      const token = makeJWT(user.id, DEFAULT_EXPIRES_IN, secret);
      const refreshToken = makeRefreshToken();

      await createRefreshToken(refreshToken, user.id)

      res.status(200).json({ ...user as UserResponse, token, refreshToken });
    } else {
      res.status(401).json({ error: "invalid email or password" });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "incorrect email or password" });
  }

}
