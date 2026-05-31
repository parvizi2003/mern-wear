import { randomUUID } from "crypto";
import type { Request, Response, NextFunction } from "express";

export const ensureSession = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let sessionId = req.cookies?.sessionId;

  if (!sessionId) {
    sessionId = randomUUID();

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
  }

  req.sessionId = sessionId;

  next();
};
