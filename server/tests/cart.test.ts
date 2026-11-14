import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";

import { Cart, CartItem } from "../src/models/cart.model.js";
import { User } from "../src/models/user.model.js";
import Category from "../src/models/category.model.js";
import { Product, ProductVariant } from "../src/models/product.model.js";

import "dotenv/config";

const testUser = {
  name: "Alex",
  email: "alex@mail.com",
  password: "password123",
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

const createTestProduct = async () => {
  const category = await Category.create({
    name: "Suits",
    slug: "suits",
  });

  const product = await Product.create({
    name: "Classic Suit",
    slug: "classic-suit",
    description: "Test suit",
    category: category._id,
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

describe("GET /api/cart", () => {
  it("should return an empty cart for a guest without creating it", async () => {
    const response = await request(app).get("/api/cart");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      items: [],
      itemsCount: 0,
      total: 0,
    });

    expect(await Cart.countDocuments()).toBe(0);
  });

  it("should return session cart if exists", async () => {
    const agent = request.agent(app);

    const firstResponse = await agent.get("/api/cart");

    const cookies = firstResponse.headers["set-cookie"] as unknown as string[];
    const sessionCookie = cookies.find((cookie) =>
      cookie.startsWith("sessionId="),
    );

    expect(sessionCookie).toBeDefined();

    const sessionId = sessionCookie!.split(";")[0].split("=")[1];

    const { product, variant } = await createTestProduct();

    const cart = await Cart.create({
      sessionId,
      itemsCount: 2,
      total: 200,
    });

    await CartItem.create({
      cart: cart._id,
      product: product._id,
      variant: variant._id,
      size: "M",
      quantity: 2,
      price: product.price,
    });

    const response = await agent.get("/api/cart");

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.itemsCount).toBe(2);
    expect(response.body.total).toBe(200);
    expect(response.body.items[0].productName).toBe(product.name);
    expect(response.body.items[0].quantity).toBe(2);
  });

  it("should return user cart if exists", async () => {
    await request(app).post("/api/auth/register").send(testUser);

    const agent = request.agent(app);

    await agent.post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    const user = await User.findOne({ email: testUser.email });
    const { product, variant } = await createTestProduct();

    const cart = await Cart.create({
      user: user!._id,
      itemsCount: 1,
      total: 100,
    });

    await CartItem.create({
      cart: cart._id,
      product: product._id,
      variant: variant._id,
      size: "M",
      quantity: 1,
      price: product.price,
    });

    const response = await agent.get("/api/cart");

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.itemsCount).toBe(1);
    expect(response.body.total).toBe(100);
    expect(response.body.items[0].productName).toBe(product.name);
  });
});

describe("POST /api/cart/items", () => {
  it("should add product to cart", async () => {
    const { product, variant } = await createTestProduct();

    const response = await request(app).post("/api/cart/items").send({
      productId: product.id,
      variantId: variant.id,
      size: "M",
    });

    expect(response.status).toBe(200);
    expect(response.body.item).toBeDefined();
    expect(response.body.item.productId).toBe(product.id);
    expect(response.body.item.variantId).toBe(variant.id);
    expect(response.body.item.size).toBe("M");
    expect(response.body.item.quantity).toBe(1);
    expect(response.body.itemsCount).toBe(1);
    expect(response.body.total).toBe(100);

    expect(await CartItem.countDocuments()).toBe(1);
  });

  it("should increment quantity when adding the same item", async () => {
    const { product, variant } = await createTestProduct();

    const agent = request.agent(app);

    const payload = {
      productId: product.id,
      variantId: variant.id,
      size: "M",
    };

    const firstResponse = await agent.post("/api/cart/items").send(payload);
    const secondResponse = await agent.post("/api/cart/items").send(payload);

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);

    expect(secondResponse.body.item.quantity).toBe(2);
    expect(secondResponse.body.itemsCount).toBe(2);
    expect(secondResponse.body.total).toBe(200);

    expect(await CartItem.countDocuments()).toBe(1);
  });

  it("should reject invalid product ID", async () => {
    const { variant } = await createTestProduct();

    const response = await request(app).post("/api/cart/items").send({
      productId: "507f1f77bcf86cd799439011",
      variantId: variant.id,
      size: "M",
    });

    expect(response.status).toBe(404);
  });

  it("should reject invalid variant ID", async () => {
    const { product } = await createTestProduct();

    const response = await request(app).post("/api/cart/items").send({
      productId: product.id,
      variantId: "507f1f77bcf86cd799439011",
      size: "M",
    });

    expect(response.status).toBe(404);
  });

  it("should reject size that does not exist in variant", async () => {
    const { product, variant } = await createTestProduct();

    const response = await request(app).post("/api/cart/items").send({
      productId: product.id,
      variantId: variant.id,
      size: "L",
    });

    expect(response.status).toBe(400);
  });

  it("should reject adding item without stock", async () => {
    const { product, variant } = await createTestProduct();

    await ProductVariant.updateOne(
      { _id: variant._id, "sizes.size": "M" },
      { $set: { "sizes.$.stock": 0 } },
    );

    const response = await request(app).post("/api/cart/items").send({
      productId: product.id,
      variantId: variant.id,
      size: "M",
    });

    expect(response.status).toBe(400);
  });
});

describe("PATCH /api/cart/items/:itemId", () => {
  const createCartItem = async (quantity = 2) => {
    const { product, variant } = await createTestProduct();

    const agent = request.agent(app);

    // Получаем sessionId и сохраняем cookie в agent
    const guestResponse = await agent.get("/api/cart");

    const cookies = guestResponse.headers["set-cookie"] as unknown as string[];

    const sessionCookie = cookies.find((cookie) =>
      cookie.startsWith("sessionId="),
    );

    const sessionId = sessionCookie!.split(";")[0].split("=")[1];

    const cart = await Cart.create({
      sessionId,
      itemsCount: quantity,
      total: quantity * product.price,
    });

    const item = await CartItem.create({
      cart: cart._id,
      product: product._id,
      variant: variant._id,
      size: "M",
      quantity,
      price: product.price,
    });

    return { item, cart, agent, sessionId };
  };

  it("should increase item quantity", async () => {
    const { item, agent } = await createCartItem(2);

    const response = await agent
      .patch(`/api/cart/items/${item.id}`)
      .send({ action: "add" });

    expect(response.status).toBe(200);
    expect(response.body.item.quantity).toBe(3);
    expect(response.body.itemsCount).toBe(3);
    expect(response.body.total).toBe(300);
  });

  it("should decrease item quantity", async () => {
    const { item, agent } = await createCartItem(2);

    const response = await agent
      .patch(`/api/cart/items/${item.id}`)
      .send({ action: "remove" });

    expect(response.status).toBe(200);
    expect(response.body.item.quantity).toBe(1);
    expect(response.body.itemsCount).toBe(1);
    expect(response.body.total).toBe(100);
  });

  it("should delete item when quantity reaches zero", async () => {
    const { item, agent } = await createCartItem(1);

    const response = await agent
      .patch(`/api/cart/items/${item.id}`)
      .send({ action: "remove" });

    expect(response.status).toBe(200);
    expect(await CartItem.findById(item.id)).toBeNull();
  });

  it("should reject updating a non-existing item", async () => {
    const response = await request(app)
      .patch("/api/cart/items/507f1f77bcf86cd799439011")
      .send({ action: "add" });

    expect(response.status).toBe(404);
  });

  it("should reject invalid action", async () => {
    const { item, agent } = await createCartItem();

    const response = await agent
      .patch(`/api/cart/items/${item.id}`)
      .send({ action: "invalid" });

    expect(response.status).toBe(400);
  });
});
