import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./connect.js";
import seedAdmin from "./seeders/seedAdmin.js";
import seedCategories from "./seeders/seedCategories.js";
import seedProducts from "./seeders/seedProducts/seedProducts.js";

async function seed() {
  try {
    await connectDB();

    await seedCategories();
    await seedAdmin();
    await seedProducts();

    console.log("Seeding completed");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
