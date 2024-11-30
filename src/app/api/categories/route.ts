import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({
      error: "User ne postoji",
    });
  }

  const userIdd = parseInt(session?.user?.id);
  try {
    const userCategories = await prisma.category.findMany({
      where: {
        userId: userIdd,
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
