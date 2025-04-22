import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { type Request } from "express";
import crypto from "crypto";

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
}

export function checkPasswordHash(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
  type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

  const payload: payload = {
    iss: "chirpy",
    sub: userID,
    iat: new Date().getTime(),
    exp: new Date().getTime() + expiresIn,
  }

  return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
  let sub = "";
  jwt.verify(tokenString, secret, (err, decoded) => {
    if (err) {
      throw err;
    } else {
      if (decoded === undefined) {
        throw new Error("unable to decode token");
      }
      if (typeof decoded === "string") {
        sub = JSON.parse(decoded).sub;
      } else {
        sub = decoded.sub ?? "";
      }
    }
  });
  return sub;
}

export function getBearerToken(req: Request): string {
  if (!req.headers.authorization) {
    throw new Error("Missing authorization header");
  }

  const [_, token] = req.headers.authorization.split(" ");
  return token.trim();
}

export function makeRefreshToken() {
  return crypto.randomBytes(32).toString("hex");
}
