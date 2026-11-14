import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { beforeAll, afterAll } from "vitest";

let mongoServer: MongoMemoryReplSet;

beforeAll(async () => {
  mongoServer = await MongoMemoryReplSet.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
