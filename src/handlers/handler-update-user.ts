import type { Request, Response } from "express";
import { getBearerToken, hashPassword, validateJWT } from "../utils/auth.js";
import { updateUser } from "../db/queries/users.js";

export default async function handlerUpdateUser(req: Request, res: Response) {
  type parameters = { email: string, password: string };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("missing jwt secret");
  }

  try {
    const token = getBearerToken(req);
    const userId = validateJWT(token, secret);
    if (!userId) {
      console.log("jwt validation failed");
      res.status(401).json({message: "not authorized" });
    }
    const params: parameters = req.body;
    const hashedPassword = hashPassword(params.password);
    const user = await updateUser(userId, { email: params.email, hashedPassword });
    res.status(200).json({ ...user });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error })
  }
}
