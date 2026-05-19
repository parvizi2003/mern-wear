import type { Document } from "mongoose";

/* ---------------- USER DOCUMENT ---------------- */

export type UserDoc = Document & {
  _id: any;
  name: string;
  email: string;
};

/* ---------------- USER DTO ---------------- */

export type UserDTO = {
  id: string;
  name: string;
  email: string;
};

export const userDTO = (user: UserDoc): UserDTO => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
};
