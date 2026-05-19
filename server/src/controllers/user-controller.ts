import User from "../models/user";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";

/* ---------------- GET ALL USERS ---------------- */

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- GET ONE USER ---------------- */

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- CREATE USER ---------------- */

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- DELETE USER ---------------- */

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
