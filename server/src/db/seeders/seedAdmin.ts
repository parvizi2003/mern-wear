import bcrypt from "bcrypt";
import { User } from "../../models/user.model.js";

export default async function seedAdmin() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error("Admin environment variables are missing");
  }

  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin created successfully");
}
