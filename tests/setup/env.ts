import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.test") });

Object.assign(process.env, { NODE_ENV: "test" });