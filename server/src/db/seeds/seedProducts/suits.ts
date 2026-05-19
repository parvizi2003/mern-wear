import Category from "../../../models/category";
import { Product, ProductVariant } from "../../../models/product";

export default async function seedSuits() {
  console.log("Seeding products...");

  const category = await Category.findOne({ slug: "suits" });

  if (!category) {
    console.log("Category suits not found");
    return;
  }

  const suits = [
    {
      name: "Classic Suit",
      slug: "classic-suit",
      price: 200,
      variants: [
        {
          color: {
            name: "Black",
            code: "#2b2b2b",
          },
          image: "/uploads/suits/classic_suit_black.webp",
          sizes: [
            { size: "S", stock: 10 },
            { size: "M", stock: 10 },
            { size: "L", stock: 10 },
          ],
        },
        {
          color: {
            name: "Navy Blue",
            code: "#2b3e5e",
          },
          image: "/uploads/suits/classic_suit_navy_blue.webp",
          sizes: [
            { size: "S", stock: 10 },
            { size: "M", stock: 10 },
            { size: "L", stock: 10 },
          ],
        },
        {
          color: {
            name: "Charcoal Gray",
            code: "#4d565b",
          },
          image: "/uploads/suits/classic_suit_charcoal_gray.webp",
          sizes: [
            { size: "S", stock: 10 },
            { size: "M", stock: 10 },
            { size: "L", stock: 10 },
          ],
        },
      ],
    },
    {
      name: "Tweed Suit",
      slug: "tweed-suit",
      price: 300,
      variants: [
        {
          color: {
            name: "Brown",
            code: "#543d2b",
          },
          image: "/uploads/suits/tweed_suit_brown.webp",
          sizes: [
            { size: "S", stock: 10 },
            { size: "M", stock: 10 },
            { size: "L", stock: 10 },
          ],
        },
        {
          color: {
            name: "Charcoal Gray",
            code: "#212727",
          },
          image: "/uploads/suits/tweed_suit_charcoal_gray.webp",
          sizes: [
            { size: "S", stock: 10 },
            { size: "M", stock: 10 },
            { size: "L", stock: 10 },
          ],
        },
        {
          color: {
            name: "Orange",
            code: "#77232c",
          },
          image: "/uploads/suits/tweed_suit_orange.webp",
          sizes: [
            { size: "S", stock: 10 },
            { size: "M", stock: 10 },
            { size: "L", stock: 10 },
          ],
        },
      ],
    },
    {
      name: "Double Breaster Suit",
      slug: "double-breasted-suit",
      price: 300,
      variants: [
        {
          color: {
            name: "Black",
            code: "#2b2b2b",
          },
          image: "/uploads/suits/double_breasted_suit_brown.webp",
          sizes: [
            { size: "S", stock: 10 },
            { size: "M", stock: 10 },
            { size: "L", stock: 10 },
          ],
        },
        {
          color: {
            name: "Tan",
            code: "#e9dbb4",
          },
          image: "/uploads/suits/double_breasted_suit_tan.webp",
          sizes: [
            { size: "S", stock: 10 },
            { size: "M", stock: 10 },
            { size: "L", stock: 10 },
          ],
        },
      ],
    },
  ];

  for (const suit of suits) {
    const existing = await Product.findOne({ slug: suit.slug });

    if (existing) {
      console.log(`Product ${suit.name} exists`);
      continue;
    }

    const product = await Product.create({
      name: suit.name,
      slug: suit.slug,
      price: suit.price,
      category: category._id,
    });

    for (const variant of suit.variants) {
      await ProductVariant.create({
        product: product._id,
        color: variant.color,
        image: variant.image,
        sizes: variant.sizes,
      });
    }

    console.log(`Product ${suit.name} created`);
  }

  console.log("Products seeding completed");
}
