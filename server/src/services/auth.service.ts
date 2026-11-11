import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

import type { RegisterInput, LoginInput } from "../schemas/auth.schema.js";
import type { AuthServiceResult } from "../dtos/auth.dto.js";
import { AppError } from "../utils/app-error.js";

const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError("JWT_SECRET is not defined", 500);
  }

  return jwt.sign({ userId }, secret, {
    expiresIn: "1d",
  });
};

export const registerUser = async ({
  name,
  email,
  password,
}: RegisterInput): Promise<AuthServiceResult> => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: "user",
  });

  const token = generateToken(user._id.toString());

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
    token,
  };
};

export const loginUser = async ({
  email,
  password,
}: LoginInput): Promise<AuthServiceResult> => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken(user._id.toString());

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
    token,
  };
};
