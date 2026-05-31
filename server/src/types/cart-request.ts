import type { Request } from "express";
import type { CartDoc } from "../dtos/cart-dto";

export interface CartRequest extends Request {
  cart: CartDoc;
}
