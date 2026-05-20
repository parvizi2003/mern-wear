import type { Request, Response } from "express";
import { Product } from "../models/product";
import { productDTO } from "../dtos/product-dto";
import Category from "../models/category";

/* ---------------- GET PRODUCTS BY CATEGORY ---------------- */

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { categorySlug } = req.params;

    const category = await Category.findOne({ slug: categorySlug });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const products = await Product.find({ category: category._id }).populate(
      "variants",
    );

    return res.json(products.map(productDTO));
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- GET PRODUCT BY SLUG ---------------- */

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate(
      "variants",
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(productDTO(product));
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- DELETE PRODUCT ---------------- */

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ message: "Product deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
