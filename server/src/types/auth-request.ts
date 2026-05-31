import type { Request } from "express";
import type { UserDTO } from "../dtos/user-dto";

export interface AuthRequest extends Request {
  user: UserDTO;
}
