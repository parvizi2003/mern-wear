import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { User } from "../src/models/user.model.js";
import { Cart, CartItem } from "../src/models/cart.model.js";
import Category from "../src/models/category.model.js";
import { Product, ProductVariant } from "../src/models/product.model.js";

import "dotenv/config";

beforeEach(async () => {
  await Promise.all([
    User.deleteMany({}),
    Cart.deleteMany({}),
    CartItem.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    ProductVariant.deleteMany({}),
  ]);
});

const testUser = {
  name: "Alex",
  email: "alex@mail.com",
  password: "password123",
};

const createTestProduct = async (
  name = "Classic Suit",
  slug = "classic-suit",
) => {
  const category = await Category.findOneAndUpdate(
    { slug: "suits" },
    { $setOnInsert: { name: "Suits", slug: "suits" } },
    { upsert: true, returnDocument: "after" },
  );

  const product = await Product.create({
    name,
    slug,
    description: "Test product",
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

const createGuestCart = async (
  agent: ReturnType<typeof request.agent>,
  items: {
    product: Awaited<ReturnType<typeof createTestProduct>>["product"];
    variant: Awaited<ReturnType<typeof createTestProduct>>["variant"];
    quantity: number;
  }[],
) => {
  const guestResponse = await agent.get("/api/cart");

  const cookies = guestResponse.headers["set-cookie"] as unknown as string[];
  const sessionCookie = cookies.find((cookie) =>
    cookie.startsWith("sessionId="),
  );

  expect(sessionCookie).toBeDefined();

  const sessionId = sessionCookie!.split(";")[0].split("=")[1];

  const guestCart = await Cart.create({ sessionId });

  for (const item of items) {
    await CartItem.create({
      cart: guestCart._id,
      product: item.product._id,
      variant: item.variant._id,
      size: "M",
      quantity: item.quantity,
      price: item.product.price,
    });
  }

  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  await Cart.updateOne({ _id: guestCart._id }, { $set: { itemsCount, total } });

  return { sessionId, guestCart };
};

const registerUser = async () => {
  await request(app).post("/api/auth/register").send(testUser);
};

describe("POST /api/auth/register", () => {
  it("should register a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe(testUser.email);
    expect(response.body.user).not.toHaveProperty("password");
    expect(response.headers["set-cookie"]).toBeDefined();

    const user = await User.findOne({ email: testUser.email });

    expect(user).not.toBeNull();
    expect(user!.password).not.toBe(testUser.password);
  });

  it("should reject registration with an existing email", async () => {
    await registerUser();

    const response = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(response.status).toBe(409);
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await registerUser();
  });

  it("should login an existing user", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe(testUser.email);
    expect(response.body.user).not.toHaveProperty("password");
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  it("should reject login with an incorrect password", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
  });

  it("should reject login for a non-existing user", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "unknown@mail.com",
      password: testUser.password,
    });

    expect(response.status).toBe(401);
  });
});

describe("Cart merge on login", () => {
  it("should assign guest cart to user when user has no cart", async () => {
    await registerUser();

    const agent = request.agent(app);
    const { product, variant } = await createTestProduct();

    const { sessionId } = await createGuestCart(agent, [
      { product, variant, quantity: 2 },
    ]);

    const response = await agent.post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(response.status).toBe(200);

    const user = await User.findOne({ email: testUser.email });
    const userCart = await Cart.findOne({ user: user!._id });

    expect(userCart).not.toBeNull();
    expect(userCart!.sessionId).toBeNull();
    expect(userCart!.itemsCount).toBe(2);
    expect(userCart!.total).toBe(200);

    expect(await Cart.countDocuments({ sessionId })).toBe(0);
  });

  it("should merge quantities of identical cart items", async () => {
    await registerUser();

    const agent = request.agent(app);

    const { product, variant } = await createTestProduct();

    const { sessionId } = await createGuestCart(agent, [
      { product, variant, quantity: 2 },
    ]);

    const user = await User.findOne({ email: testUser.email });

    const userCart = await Cart.create({
      user: user!._id,
      itemsCount: 1,
      total: 100,
    });

    await CartItem.create({
      cart: userCart._id,
      product: product._id,
      variant: variant._id,
      size: "M",
      quantity: 1,
      price: product.price,
    });

    const response = await agent.post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(response.status).toBe(200);

    const mergedCart = await Cart.findOne({ user: user!._id });
    const items = await CartItem.find({ cart: mergedCart!._id });

    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
    expect(mergedCart!.itemsCount).toBe(3);
    expect(mergedCart!.total).toBe(300);

    expect(await Cart.countDocuments({ sessionId })).toBe(0);
  });

  it("should merge different cart items", async () => {
    await registerUser();

    const agent = request.agent(app);

    const guestProduct = await createTestProduct(
      "Classic Suit",
      "classic-suit",
    );

    const otherProduct = await createTestProduct(
      "Winter Jacket",
      "winter-jacket",
    );

    const { sessionId } = await createGuestCart(agent, [
      {
        product: guestProduct.product,
        variant: guestProduct.variant,
        quantity: 2,
      },
    ]);

    const user = await User.findOne({ email: testUser.email });

    const userCart = await Cart.create({
      user: user!._id,
      itemsCount: 1,
      total: 100,
    });

    await CartItem.create({
      cart: userCart._id,
      product: otherProduct.product._id,
      variant: otherProduct.variant._id,
      size: "M",
      quantity: 1,
      price: otherProduct.product.price,
    });

    const response = await agent.post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(response.status).toBe(200);

    const mergedCart = await Cart.findOne({ user: user!._id });
    const items = await CartItem.find({ cart: mergedCart!._id });

    expect(items).toHaveLength(2);
    expect(mergedCart!.itemsCount).toBe(3);
    expect(mergedCart!.total).toBe(300);

    expect(await Cart.countDocuments({ sessionId })).toBe(0);
  });
});

describe("POST /api/auth/logout", () => {
  it("should reject logout without authentication", async () => {
    const response = await request(app).post("/api/auth/logout");

    expect(response.status).toBe(401);
  });

  it("should logout an authenticated user", async () => {
    const agent = request.agent(app);

    await agent.post("/api/auth/register").send(testUser);

    const response = await agent.post("/api/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Logged out successfully");
    expect(response.headers["set-cookie"]).toBeDefined();
  });
});

describe("Protected routes", () => {
  it("should reject request without token", async () => {
    const response = await request(app).post("/api/auth/logout");

    expect(response.status).toBe(401);
  });

  it("should reject request with invalid token", async () => {
    const response = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", "token=invalid-token");

    expect(response.status).toBe(401);
  });

  it("should allow request with valid token", async () => {
    const agent = request.agent(app);

    await agent.post("/api/auth/register").send(testUser);

    const response = await agent.post("/api/auth/logout");

    expect(response.status).toBe(200);
  });
});
