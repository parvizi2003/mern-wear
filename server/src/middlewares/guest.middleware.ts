import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";

export const guest = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    next();
    return;
  }

  let sessionId = req.cookies?.sessionId;

  if (!sessionId) {
    sessionId = randomUUID();

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  req.sessionId = sessionId;
  next();
};
