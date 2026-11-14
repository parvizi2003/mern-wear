import { UserDto } from "../dtos/user.dto.ts";
import type { CartDocument } from "../models/cart.model.js";

declare global {
  namespace Express {
    interface Request {
      user?: UserDto;
      sessionId?: string;
      cart?: CartDocument;
    }
  }
}

export {};
