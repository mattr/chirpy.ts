import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

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

function validateJWT(tokenString: string, secret: string): string {
  jwt.decode(tokenString, secret, (err, decoded) => {
    if (err) {
      throw err;
    } else {
      return decoded.sub;
    }
  });
}