import { Router } from "express";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.ts";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category, cursor, cursorId, limit = 20 } = req.query;

    const take = Math.min(parseInt(limit), 100); // cap at 100

    const where = {};
    if (category) where.category = category;

    // if cursor exists, add the pagination condition
    if (cursor && cursorId) {
      where.OR = [
        { createdAt: { lt: new Date(cursor) } },
        { createdAt: new Date(cursor), id: { lt: cursorId } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take,
    });

    // build next cursor from last item
    const lastItem = products[products.length - 1];
    const nextCursor = lastItem ? lastItem.createdAt.toISOString() : null;
    const nextCursorId = lastItem ? lastItem.id : null;

    res.json({
      data: products,
      nextCursor,
      nextCursorId,
      hasMore: products.length === take,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
