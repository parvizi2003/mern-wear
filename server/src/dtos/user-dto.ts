import type { Document, Types } from "mongoose";

export type UserDoc = Document & {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: string;
};

export type UserDTO = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export const userDTO = (user: UserDoc): UserDTO => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
};
