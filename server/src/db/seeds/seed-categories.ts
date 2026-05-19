import Category from "../../models/category";

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
    const existingCategory = await Category.findOne({
      slug: category.slug,
    });

    if (existingCategory) {
      console.log(`Category "${category.name}" already exists`);
      continue;
    }

    await Category.create(category);
    console.log(`Category "${category.name}" created`);
  }

  console.log("Categories seeding completed");
}
