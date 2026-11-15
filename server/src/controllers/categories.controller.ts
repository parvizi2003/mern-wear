import type { Request, Response } from "express";
import Category from "../models/category.model.js";
import { CategoryDto } from "../dtos/category.dto.js";
import { Product } from "../models/product.model.js";
import { PopulatedVariant } from "../dtos/product.dto.js";
import { ProductDto } from "../dtos/product.dto.js";
import { categoryInput } from "../schemas/category.schema.js";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "../services/category.servise.js";

export const getCategories = async (req: Request, res: Response) => {
  const categories = await Category.find().sort({ name: 1 });

  const categoriesDto: CategoryDto[] = categories.map((category) => ({
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
  }));

  res.status(200).json(categoriesDto);
};

export const getCategoryProducts = async (req: Request, res: Response) => {
  const { slug } = req.params;

  const category = await Category.findOne({ slug });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const products = await Product.find({ category: category._id }).populate<{
    variants: PopulatedVariant[];
  }>("variants");

  const productsDto: ProductDto[] = products.map((product) => ({
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    category: category.slug,
    variants: product.variants.map((variant) => ({
      id: variant._id.toString(),
      color: variant.color,
      image: variant.image,
      sizes: variant.sizes,
    })),
  }));

  return res.status(200).json(productsDto);
};

export const create = async (
  data: categoryInput,
  _req: Request,
  res: Response,
) => {
  const category = await createCategory(data);

  res.status(201).json(category);
};

export const update = async (
  data: categoryInput,
  req: Request,
  res: Response,
) => {
  const id = req.params.id as string;
  const category = await updateCategory(data, id);
  res.status(200).json(category);
};

export const remove = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const categoryId = await deleteCategory(id);

  res.status(200).json(categoryId);
};
