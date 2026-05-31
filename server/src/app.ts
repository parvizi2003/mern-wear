import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ensureSession } from "./middleware/ensure-session";
import UserRouter from "./routes/user-routes";
import AuthRouter from "./routes/auth-routes";
import CategoryRouter from "./routes/category-routes";
import ProductRouter from "./routes/product-routes";
import CartRouter from "./routes/cart-routes";
import OrderRouter from "./routes/order-routes";
import { optionalAuth } from "./middleware/optional-auth";
import { ensureCart } from "./middleware/ensure-cart";

const app = express();

/* -------------------- CONFIG -------------------- */

const allowedOrigins = [process.env.ADMIN_URL, process.env.CLIENT_URL].filter(
  Boolean,
) as string[];

/* -------------------- MIDDLEWARE -------------------- */

// CORS (clean + scalable)
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(ensureSession);
app.use("/uploads", express.static("uploads"));

/* -------------------- ROUTES -------------------- */

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", AuthRouter);
app.use("/users", UserRouter);
app.use("/categories", CategoryRouter);
app.use("/products", ProductRouter);
app.use("/cart", optionalAuth, ensureCart, CartRouter);
app.use("/orders", OrderRouter);

/* -------------------- 404 -------------------- */

app.use((_req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

export default app;
