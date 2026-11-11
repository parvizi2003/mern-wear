import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/user.model.js";

import "dotenv/config";

beforeEach(async () => {
  await User.deleteMany({});
});

const testUser = {
  name: "Alex",
  email: "alex@mail.com",
  password: "password123",
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
    await request(app).post("/api/auth/register").send(testUser);

    const response = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(response.status).toBe(409);
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/register").send(testUser);
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
