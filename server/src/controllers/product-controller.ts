import type { Request, Response } from "express";
import { Product } from "../models/product";
import { productDTO } from "../dtos/product-dto";

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

/* ---------------- New PRODUCTS ---------------- */

export const getNewProducts = async (req: Request, res: Response) => {
  try {
    const newProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("variants");

    return res.status(200).json(newProducts.map(productDTO));
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- RELATED PRODUCTS ---------------- */

export const getRelatedProducts = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .limit(4)
      .populate("variants");

    return res.json(relatedProducts.map(productDTO));
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
