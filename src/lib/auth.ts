import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // ⚠️ use strong key in production

// Hash password
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

// Compare password
export async function comparePassword(password: string, hashed: string) {
  return await bcrypt.compare(password, hashed);
}

// Generate JWT
export function generateToken(userId: number, role: Role) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "1d" });
}

// Verify JWT
export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: number; role: Role };
}
