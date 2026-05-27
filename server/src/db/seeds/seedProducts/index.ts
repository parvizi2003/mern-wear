import Category from "../../../models/category";
import { Product, ProductVariant } from "../../../models/product";

import suits from "./data/suits.json";
import jackets from "./data/jackets.json";
import shoes from "./data/shoes.json";
import shirts from "./data/shirts.json";
import pants from "./data/pants.json";

import { generateSlug } from "../../../utils/generate-slug";

const collections = [
  {
    categorySlug: "suits",
    items: suits,
  },
  {
    categorySlug: "jackets",
    items: jackets,
  },
  {
    categorySlug: "pants",
    items: pants,
  },
  {
    categorySlug: "shoes",
    items: shoes,
  },
  {
    categorySlug: "shirts",
    items: shirts,
  },
];

export default async function seedProducts() {
  console.log("Seeding products...");

  for (const collection of collections) {
    const category = await Category.findOne({
      slug: collection.categorySlug,
    });

    if (!category) {
      console.log(`Category ${collection.categorySlug} not found`);

      continue;
    }

    for (const item of collection.items) {
      const itemSlug = generateSlug(item.name);

      const existing = await Product.findOne({
        slug: itemSlug,
      });

      if (existing) {
        console.log(`Product ${item.name} already exists`);

        continue;
      }

      // CREATE PRODUCT
      const product = await Product.create({
        name: item.name,
        slug: itemSlug,
        description: item.description || "",
        price: item.price,
        category: category._id,
        variants: [],
      });

      // CREATE VARIANTS
      const variantIds = [];

      for (const variant of item.variants) {
        const createdVariant = await ProductVariant.create({
          product: product._id,

          color: variant.color,

          image: variant.image,

          sizes: variant.sizes,
        });

        variantIds.push(createdVariant._id);
      }

      // LINK VARIANTS
      product.variants = variantIds;

      await product.save();

      console.log(`Created ${item.name}`);
    }
  }

  console.log("Products seeding completed");
}
