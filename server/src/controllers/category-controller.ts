import Category from "../models/category";
import type { Request, Response } from "express";
import { categoryDTO } from "../dtos/category-dto";
import { generateSlug } from "../utils/generate-slug";
import { categorySchema } from "../validators/category-validator";
import { Product } from "../models/product";
import { productDTO } from "../dtos/product-dto";
import { paginationDTO } from "../dtos/pagination-dto";

/* ---------------- GET ALL CATEGORIES ---------------- */

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();

    return res.json(categories.map(categoryDTO));
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- GET CATEGORY BY SLUG ---------------- */

export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.json(categoryDTO(category));
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- GET CATEGORY PRODUCTS BY SLUG ---------------- */

export const getCategoryProducts = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const category = await Category.findOne({
      slug: req.params.slug,
    }).lean();

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const [products, total] = await Promise.all([
      Product.find({
        category: category._id,
      })
        .populate("variants")
        .skip(skip)
        .limit(limit),

      Product.countDocuments({
        category: category._id,
      }),
    ]);

    return res.status(200).json(
      paginationDTO({
        data: products.map(productDTO),
        page,
        total,
        totalPages: Math.ceil(total / limit),
      }),
    );
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* ---------------- CREATE CATEGORY ---------------- */

export const createCategory = async (req: Request, res: Response) => {
  try {
    const result = categorySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }
    const { name } = result.data;

    const slug = generateSlug(name);

    const existing = await Category.findOne({ slug });

    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name,
      slug,
    });

    return res.status(201).json(categoryDTO(category));
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- DELETE CATEGORY ---------------- */

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.json({ message: "Category deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
