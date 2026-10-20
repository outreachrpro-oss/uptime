import bcrypt from "bcryptjs";

const ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function validatePasswordStrength(password: string): {
  ok: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (password.length < 8) errors.push("Password must be at least 8 characters");
  if (password.length > 128) errors.push("Password must be at most 128 characters");
  if (!/[a-z]/.test(password)) errors.push("Password must include a lowercase letter");
  if (!/[A-Z]/.test(password)) errors.push("Password must include an uppercase letter");
  if (!/[0-9]/.test(password)) errors.push("Password must include a number");
  return { ok: errors.length === 0, errors };
}
