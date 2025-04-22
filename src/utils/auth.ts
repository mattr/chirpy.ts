import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { type Request } from "express";
import crypto from "crypto";

// 1 hour in ms
const DEFAULT_EXPIRES_IN_MS = 60 * 60 * 1000;
const DEFAULT_SECRET = process.env.JWT_SECRET;

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
}

export function checkPasswordHash(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function makeJWT(userID: string, expiresIn: number = DEFAULT_EXPIRES_IN_MS, secret: string = DEFAULT_SECRET!): string {
  type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

  const iat = Date.now();
  const exp = iat + expiresIn;

  // iat is in seconds, Date.now() is in ms
  const payload: payload = {
    iss: "chirpy",
    sub: userID,
    iat: Math.floor(iat / 1000),
    exp: Math.floor(exp / 1000),
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
    throw new Error("[getBearerToken] missing authorization header");
  }

  const [_, token] = req.headers.authorization.split(" ");
  return token.trim();
}

export function makeRefreshToken() {
  return crypto.randomBytes(32).toString("hex");
}
