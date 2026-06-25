import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

const categories = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Kitchen",
  "Sports",
  "Toys",
  "Beauty",
  "Automotive",
  "Grocery",
  "Office Supplies",
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function generateProducts(count) {
  const products = [];

  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    products.push({
      name: `Product ${i + 1} - ${category}`,
      category,
      price: parseFloat(randomBetween(10, 10000).toFixed(2)),
    });
  }

  return products;
}

async function main() {
  console.log("Seeding started...");

  const TOTAL = 200000;
  const BATCH_SIZE = 5000;
  const batches = TOTAL / BATCH_SIZE;

  for (let i = 0; i < batches; i++) {
    const products = generateProducts(BATCH_SIZE);

    await prisma.product.createMany({
      data: products,
    });

    console.log(`Inserted batch ${i + 1}/${batches}`);
  }

  console.log("Seeding complete. 200,000 products inserted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
