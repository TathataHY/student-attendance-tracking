import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  driver: "mysql2",
  dbCredentials: {
    host: process.env.DB_URL,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  },
};
