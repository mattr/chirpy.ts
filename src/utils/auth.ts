import bcrypt from "bcrypt";

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
}

export function checkPasswordHash(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}