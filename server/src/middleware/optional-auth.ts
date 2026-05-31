import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { userDTO } from "../dtos/user-dto";

const JWT_SECRET = process.env.JWT_SECRET!;
type JwtPayload = { sub: string };

export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.token;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.sub);
    if (!user) return next();

    req.user = userDTO(user);
  } catch {}

  next();
};
