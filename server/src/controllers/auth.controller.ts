import type { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service.js";
import type { RegisterInput, LoginInput } from "../schemas/auth.schema.js";

export const register = async (
  data: RegisterInput,

  res: Response,
) => {
  const { user, token } = await registerUser(data);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).json({ user });
};

export const login = async (data: LoginInput, res: Response) => {
  const { user, token } = await loginUser(data);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ user });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
};
