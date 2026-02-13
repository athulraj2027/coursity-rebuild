import type { Role } from "@prisma/client";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "myjwtsecret";

export default function generateToken(
  userId: string,
  role: Role,
  username: string,
) {
  return jwt.sign({ userId, role, username }, JWT_SECRET, {
    expiresIn: "7d",
  });
}
