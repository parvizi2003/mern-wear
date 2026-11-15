import mongoose from "mongoose";
import { CategoryDto } from "../dtos/category.dto.js";
import Category from "../models/category.model.js";
import { Product, ProductVariant } from "../models/product.model.js";
import { categoryInput } from "../schemas/category.schema.js";
import { AppError } from "../utils/app-error.js";

export const createCategory = async ({
  name,
}: categoryInput): Promise<CategoryDto> => {
  const slug = name.toLowerCase().replace(/ /g, "-");

  const existingCategory = await Category.findOne({ slug });

  if (existingCategory) {
    throw new AppError("Category already exists", 400);
  }

  const category = new Category({ name, slug });
  await category.save();

  return category;
};

export const updateCategory = async (
  { name }: categoryInput,
  id: string,
): Promise<CategoryDto> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid category ID", 400);
  }

  const slug = name.toLowerCase().replace(/ /g, "-");

  const [category, existingCategory] = await Promise.all([
    Category.findById(id),
    Category.findOne({ slug, _id: { $ne: id } }),
  ]);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  if (existingCategory) {
    throw new AppError("Category already exists", 400);
  }

  category.name = name;
  category.slug = slug;

  await category.save();
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
  };
};

export const deleteCategory = async (id: string): Promise<{ id: string }> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid category ID", 400);
  }
  const session = await mongoose.startSession();

  try {
    let deletedId = "";

    await session.withTransaction(async () => {
      const category = await Category.findById(id).session(session);

      if (!category) {
        throw new AppError("Category not found", 404);
      }

      const products = await Product.find({
        category: category._id,
      })
        .select("_id")
        .session(session);

      const productIds = products.map((product) => product._id);

      await ProductVariant.deleteMany({
        product: { $in: productIds },
      }).session(session);

      await Product.deleteMany({
        category: category._id,
      }).session(session);

      await category.deleteOne({ session });

      deletedId = category._id.toString();
    });

    return { id: deletedId };
  } finally {
    await session.endSession();
  }
};
