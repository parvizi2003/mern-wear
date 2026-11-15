import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";

import Category from "../src/models/category.model.js";
import { Product, ProductVariant } from "../src/models/product.model.js";
import { Cart, CartItem } from "../src/models/cart.model.js";
import { User } from "../src/models/user.model.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import "dotenv/config";

const testUser = {
  name: "Alex",
  email: "alex@mail.com",
  password: "password123",
};

const createTestUser = async (role: "user" | "admin" = "user") => {
  const password = await bcrypt.hash(testUser.password, 10);

  return User.create({
    name: testUser.name,
    email: `${role}-${testUser.email}`,
    password,
    role,
  });
};

const loginAgent = async (role: "user" | "admin" = "user") => {
  const user = await createTestUser(role);
  const agent = request.agent(app);

  const token = jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" },
  );

  await agent.set("Cookie", `token=${token}`);

  return { agent, user };
};

const createTestCategory = async (name = "Suits", slug = "suits") => {
  return Category.create({ name, slug });
};

const createTestProduct = async (categoryId: mongoose.Types.ObjectId) => {
  const product = await Product.create({
    name: "Classic Suit",
    slug: "classic-suit",
    description: "Test suit",
    category: categoryId,
    price: 100,
  });

  const variant = await ProductVariant.create({
    product: product._id,
    color: {
      name: "black",
      code: "#000000",
    },
    image: "/test.jpg",
    sizes: [{ size: "M", stock: 10 }],
  });

  return { product, variant };
};

beforeEach(async () => {
  await Promise.all([
    Cart.deleteMany({}),
    CartItem.deleteMany({}),
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    ProductVariant.deleteMany({}),
  ]);
});

describe("GET /api/categories", () => {
  it("should return all categories", async () => {
    await createTestCategory("Suits", "suits");
    await createTestCategory("Shirts", "shirts");

    const response = await request(app).get("/api/categories");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("slug");
  });

  it("should return categories sorted by name", async () => {
    await createTestCategory("Suits", "suits");
    await createTestCategory("Accessories", "accessories");

    const response = await request(app).get("/api/categories");

    expect(response.status).toBe(200);
    expect(response.body[0].name).toBe("Accessories");
    expect(response.body[1].name).toBe("Suits");
  });

  it("should return empty array when no categories exist", async () => {
    const response = await request(app).get("/api/categories");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe("GET /api/categories/:slug", () => {
  it("should return products of category", async () => {
    const category = await createTestCategory();
    const { product, variant } = await createTestProduct(category._id);

    const response = await request(app).get(`/api/categories/${category.slug}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].id).toBe(product.id);
    expect(response.body[0].name).toBe(product.name);
    expect(response.body[0].category).toBe(category.slug);
    expect(response.body[0].variants).toHaveLength(1);
    expect(response.body[0].variants[0].id).toBe(variant.id);
  });

  it("should return empty array when category has no products", async () => {
    const category = await createTestCategory();

    const response = await request(app).get(`/api/categories/${category.slug}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should return 404 for non-existing category", async () => {
    const response = await request(app).get("/api/categories/non-existing");

    expect(response.status).toBe(404);
  });
});

describe("POST /api/categories", () => {
  it("should create category as admin", async () => {
    const { agent } = await loginAgent("admin");

    const response = await agent.post("/api/categories").send({
      name: "Shoes",
    });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Shoes");
    expect(response.body.slug).toBe("shoes");
    expect(await Category.countDocuments()).toBe(1);
  });

  it("should reject duplicate category", async () => {
    const { agent } = await loginAgent("admin");
    await createTestCategory("Shoes", "shoes");

    const response = await agent.post("/api/categories").send({
      name: "Shoes",
    });

    expect(response.status).toBe(400);
  });

  it("should reject invalid category data", async () => {
    const { agent } = await loginAgent("admin");

    const response = await agent.post("/api/categories").send({
      name: "",
    });

    expect(response.status).toBe(400);
  });

  it("should reject unauthenticated request", async () => {
    const response = await request(app).post("/api/categories").send({
      name: "Shoes",
    });

    expect(response.status).toBe(401);
  });

  it("should reject regular user", async () => {
    const { agent } = await loginAgent("user");

    const response = await agent.post("/api/categories").send({
      name: "Shoes",
    });

    expect(response.status).toBe(403);
  });
});

describe("PATCH /api/categories/:id", () => {
  it("should update category as admin", async () => {
    const { agent } = await loginAgent("admin");
    const category = await createTestCategory();

    const response = await agent
      .patch(`/api/categories/${category.id}`)
      .send({ name: "Formal Suits" });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Formal Suits");
    expect(response.body.slug).toBe("formal-suits");

    const updated = await Category.findById(category._id);
    expect(updated?.name).toBe("Formal Suits");
  });

  it("should allow updating category without changing its name", async () => {
    const { agent } = await loginAgent("admin");
    const category = await createTestCategory();

    const response = await agent
      .patch(`/api/categories/${category.id}`)
      .send({ name: "Suits" });

    expect(response.status).toBe(200);
    expect(response.body.slug).toBe("suits");
  });

  it("should reject duplicate slug", async () => {
    const { agent } = await loginAgent("admin");

    await createTestCategory("Suits", "suits");
    const second = await createTestCategory("Shirts", "shirts");

    const response = await agent
      .patch(`/api/categories/${second.id}`)
      .send({ name: "Suits" });

    expect(response.status).toBe(400);
  });

  it("should return 404 for non-existing category", async () => {
    const { agent } = await loginAgent("admin");

    const response = await agent
      .patch("/api/categories/507f1f77bcf86cd799439011")
      .send({ name: "New name" });

    expect(response.status).toBe(404);
  });

  it("should reject invalid category ID", async () => {
    const { agent } = await loginAgent("admin");

    const response = await agent
      .patch("/api/categories/invalid-id")
      .send({ name: "New name" });

    expect(response.status).toBe(400);
  });

  it("should reject unauthenticated request", async () => {
    const category = await createTestCategory();

    const response = await request(app)
      .patch(`/api/categories/${category.id}`)
      .send({ name: "New name" });

    expect(response.status).toBe(401);
  });
});

describe("DELETE /api/categories/:id", () => {
  it("should delete empty category", async () => {
    const { agent } = await loginAgent("admin");
    const category = await createTestCategory();

    const response = await agent.delete(`/api/categories/${category.id}`);

    expect(response.status).toBe(200);
    expect(await Category.findById(category._id)).toBeNull();
  });

  it("should delete category with products and variants", async () => {
    const { agent } = await loginAgent("admin");
    const category = await createTestCategory();
    const { product, variant } = await createTestProduct(category._id);

    const response = await agent.delete(`/api/categories/${category.id}`);

    expect(response.status).toBe(200);
    expect(await Category.findById(category._id)).toBeNull();
    expect(await Product.findById(product._id)).toBeNull();
    expect(await ProductVariant.findById(variant._id)).toBeNull();
  });

  it("should return 404 for non-existing category", async () => {
    const { agent } = await loginAgent("admin");

    const response = await agent.delete(
      "/api/categories/507f1f77bcf86cd799439011",
    );

    expect(response.status).toBe(404);
  });

  it("should reject unauthenticated request", async () => {
    const category = await createTestCategory();

    const response = await request(app).delete(
      `/api/categories/${category.id}`,
    );

    expect(response.status).toBe(401);
  });

  it("should reject regular user", async () => {
    const { agent } = await loginAgent("user");
    const category = await createTestCategory();

    const response = await agent.delete(`/api/categories/${category.id}`);

    expect(response.status).toBe(403);
  });
});
