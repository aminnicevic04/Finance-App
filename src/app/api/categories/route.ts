import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const userCategories = await prisma.category.findMany({
      where: {
        userId: 1,
      },
      include: {
        products: true,
      },
    });

    const categories = userCategories.map((category) => ({
      id: category.id,
      name: category.name,
      products: category.products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
      })),
    }));

    console.log(categories);

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories and products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
