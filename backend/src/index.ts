import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();
const app = express();

// Example route to test DB
app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.listen(4000, () => {
  console.log("Backend running at http://localhost:4000");
});