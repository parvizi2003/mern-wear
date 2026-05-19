import User from "../models/user";
import { userDTO } from "../dtos/user-dto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginSchema, registerSchema } from "../validators/auth-validator";
import type { Request, Response } from "express";

const generateToken = (userId: string) => {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

/* ---------------- REGISTER ---------------- */

export const register = async (req: Request, res: Response) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { name, email, password } = result.data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const token = generateToken(user._id.toString());

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      user: userDTO(user),
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- LOGIN ---------------- */

export const login = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { email, password } = result.data;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString());

    res.cookie("token", token, cookieOptions);

    return res.json({
      user: userDTO(user),
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- LOGOUT ---------------- */

export const logout = (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ message: "Already logged out" });
  }

  res.clearCookie("token");

  return res.json({ message: "Logged out" });
};

/* ---------------- ME ---------------- */

export const me = (req: Request, res: Response) => {
  return res.json({
    user: req.user,
  });
};
