import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const userCategories = await prisma.expenseCategory.findMany({
      where: {
        userId: 1,
      },
      include: {
        expenses: true,
      },
    });

    const categories = userCategories.map((category) => ({
      id: category.id,
      name: category.name,
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
