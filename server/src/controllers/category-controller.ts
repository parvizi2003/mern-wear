import Category from "../models/category";
import type { Request, Response } from "express";
import { categoryDTO } from "../dtos/category-dto";
import { generateSlug } from "../utils/generate-slug";
import { categorySchema } from "../validators/category-validator";

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

/* ---------------- CREATE CATEGORY ---------------- */

export const createCategory = async (req: Request, res: Response) => {
  try {
    const result = categorySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.flatten().fieldErrors,
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
