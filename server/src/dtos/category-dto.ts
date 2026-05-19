import type { Document } from "mongoose";

/* ---------------- TYPES ---------------- */

export type CategoryDoc = Document & {
  _id: any;
  name: string;
  slug: string;
};

/* ---------------- SINGLE DTO ---------------- */

export const categoryDTO = (category: CategoryDoc) => {
  return {
    id: category._id,
    name: category.name,
    slug: category.slug,
  };
};
