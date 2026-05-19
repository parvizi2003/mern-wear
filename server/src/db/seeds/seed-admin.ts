import bcrypt from "bcryptjs";
import User from "../../models/user";

export default async function seedAdmin() {
  const existingAdmin = await User.findOne({
    email: "admin@example.com",
  });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Admin",
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin created");
}
