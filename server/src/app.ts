import express from "express";
import User from "./routes/user";
import Auth from "./routes/auth";

const app = express();

app.use(express.json());

app.use("/auth", Auth);
app.use("/users", User);

app.get("/", (_req, res) => {
  res.json({
    message: "API works",
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    method: req.method,
    path: req.path,
  });
});

export default app;
