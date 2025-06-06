import bcrypt from "bcrypt";

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function comparePasswords(raw, hash) {
  return bcrypt.compare(raw, hash);
}
