import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import UserRouter from "./routes/user";
import AuthRouter from "./routes/auth";

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

/* -------------------- ROUTES -------------------- */

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", AuthRouter);
app.use("/users", UserRouter);

/* -------------------- 404 -------------------- */

app.use((_req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

export default app;
