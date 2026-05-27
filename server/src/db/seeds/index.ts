import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../config";
import seedAdmin from "./seed-admin";
import seedCategories from "./seed-categories";
import seedProducts from "./seedProducts";

const seed = async () => {
  try {
    await connectDB();
    await seedAdmin();
    await seedCategories();
    await seedProducts();
    console.log("Seeding completed");

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

seed();
