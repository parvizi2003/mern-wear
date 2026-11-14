import Category from "../../../models/category.model.js";
import { Product, ProductVariant } from "../../../models/product.model.js";

import suits from "./productsData/suits.json" with { type: "json" };
import jackets from "./productsData/jackets.json" with { type: "json" };
import shoes from "./productsData/shoes.json" with { type: "json" };
import shirts from "./productsData/shirts.json" with { type: "json" };
import pants from "./productsData/pants.json" with { type: "json" };

import { generateSlug } from "../../../utils/generate-slug.js";

const collections = [
  { categorySlug: "suits", items: suits },
  { categorySlug: "jackets", items: jackets },
  { categorySlug: "pants", items: pants },
  { categorySlug: "shoes", items: shoes },
  { categorySlug: "shirts", items: shirts },
];

export default async function seedProducts() {
  console.log("Seeding products...");

  for (const collection of collections) {
    const category = await Category.findOne({
      slug: collection.categorySlug,
    });

    if (!category) {
      console.warn(`Category "${collection.categorySlug}" not found`);
      continue;
    }

    for (const item of collection.items) {
      const slug = generateSlug(item.name);

      const existingProduct = await Product.findOne({ slug });

      if (existingProduct) {
        console.log(`Product "${item.name}" already exists`);
        continue;
      }

      const product = await Product.create({
        name: item.name,
        slug,
        description: item.description || "",
        price: item.price,
        category: category._id,
      });

      for (const variant of item.variants) {
        await ProductVariant.create({
          product: product._id,
          color: variant.color,
          image: variant.image,
          sizes: variant.sizes,
        });
      }

      console.log(`Created product "${item.name}"`);
    }
  }

  console.log("Products seeding completed");
}
