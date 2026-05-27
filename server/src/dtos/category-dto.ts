import type { Document, Types } from "mongoose";

/* ---------------- TYPES ---------------- */

export type CategoryDoc = Document & {
  _id: Types.ObjectId;
  name: string;
  slug: string;
};

export type CaregoryDto = {
  id: string;
  name: string;
  slug: string;
};

/* ---------------- SINGLE DTO ---------------- */

export const categoryDTO = (category: CategoryDoc): CaregoryDto => {
  return {
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
  };
};
