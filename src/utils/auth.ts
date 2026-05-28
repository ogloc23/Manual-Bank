import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const hashValue = async (value: string): Promise<string> => {
  return bcrypt.hash(value, 10);
};

export const compareHash = async (
  value: string,
  hashedValue: string,
): Promise<boolean> => {
  return bcrypt.compare(value, hashedValue);
};