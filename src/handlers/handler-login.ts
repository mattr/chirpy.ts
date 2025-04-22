import { Request, Response } from "express";
import { GetUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "../utils/auth.js";
import { UserResponse } from "src/schema.js";
import { createRefreshToken } from "../db/queries/refresh-tokens.js";

export default async function handlerLogin(req: Request, res: Response) {
  type parameters = { email: string, password: string };

  try {
    const { email, password }: parameters = req.body;
    const user = await GetUserByEmail(email)
    // @ts-ignore
    if (user && checkPasswordHash(password, user.hashedPassword)) {
      const token = makeJWT(user.id);
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
