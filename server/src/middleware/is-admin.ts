import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth-request";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const AuthReq = req as AuthRequest;
    const user = AuthReq.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
