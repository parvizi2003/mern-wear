import { CartDoc } from "../dtos/cart-dto";
import type { UserDTO } from "../dtos/user-dto";

declare global {
  namespace Express {
    interface Request {
      user?: UserDTO;
      cart?: CartDoc;
      sessionId?: string;
    }
  }
}

export {};
