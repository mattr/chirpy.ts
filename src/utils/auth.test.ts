import { describe, it, expect, beforeAll } from 'vitest';
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from './auth.js';
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = hashPassword(password1);
    hash2 = hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return false for the incorrect password", async () => {
    const result = checkPasswordHash(password1, hash2);
    expect(result).toBe(false);
  })
});

describe("JWT", () => {
  const userID = "user";
  const expiresIn = 100;
  const secret = "12345";

  it("returns the subject for a valid JWT", async () => {
    const jwt = makeJWT(userID, expiresIn, secret);
    expect(validateJWT(jwt, secret)).toBe("user");
  });

  it("throws an error with a bad secret", async ({ expect }) => {
    const jwt = makeJWT(userID, expiresIn, secret);
    expect(() => validateJWT(jwt, "123456")).toThrowError(JsonWebTokenError)
  });

  // it("throws an error when expired", async({expect}) => {
  //   const jwt = makeJWT(userID, expiresIn, secret);
  //   await new Promise(resolve => setTimeout(resolve, 1500));
  //   expect(() => validateJWT(jwt, secret)).toThrowError(TokenExpiredError);
  // });
})
