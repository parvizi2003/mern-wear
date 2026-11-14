import type { Request, Response } from "express";
import { Product } from "../models/product.model.js";
import type {
  PopulatedCategory,
  PopulatedVariant,
  ProductDto,
} from "../dtos/product.dto.js";

export const getProductBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug })
    .populate<{ category: PopulatedCategory }>("category", "slug")
    .populate<{ variants: PopulatedVariant[] }>("variants");

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const productDto: ProductDto = {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    category: product.category.slug,
    variants: product.variants.map((variant) => ({
      id: variant._id.toString(),
      color: variant.color,
      image: variant.image,
      sizes: variant.sizes,
    })),
  };

  return res.status(200).json(productDto);
};
