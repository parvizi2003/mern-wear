import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../config";
import seedAdmin from "./seed-admin";
import seedCategories from "./seed-categories";
import seedSuits from "./seedProducts/suits";

const seed = async () => {
  try {
    await connectDB();
    await seedAdmin();
    await seedCategories();
    await seedSuits();
    console.log("Seeding completed");

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

seed();
