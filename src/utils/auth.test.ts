import { describe, it, expect, beforeAll } from 'vitest';
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from './auth.js';


describe('Password Hashing', () => {
  const password1 = 'correctPassword123!';
  const password2 = 'anotherPassword456!';
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = hashPassword(password1);
    hash2 = hashPassword(password2);
  });

  it('should return true for the correct password', async () => {
    const result = checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});