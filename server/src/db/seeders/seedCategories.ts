import Category from "../../models/category.model.js";

export default async function seedCategories() {
  console.log("Seeding categories...");

  const categories = [
    { name: "Suits", slug: "suits" },
    { name: "Shirts", slug: "shirts" },
    { name: "Jackets", slug: "jackets" },
    { name: "Pants", slug: "pants" },
    { name: "Shoes", slug: "shoes" },
  ];

  for (const category of categories) {
    await Category.updateOne(
      { slug: category.slug },
      { $setOnInsert: category },
      { upsert: true },
    );
  }

  console.log("Categories seeding completed");
}
