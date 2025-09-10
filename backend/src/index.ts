import dotenv from "dotenv";
dotenv.config(); // loads from root .env

console.log("DB URL:", process.env.DATABASE_URL);