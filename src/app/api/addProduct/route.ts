import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { categoryId, productName, price, userId } = await req.json();

    const newProduct = await prisma.product.create({
      data: {
        name: productName,
        price: price,
        categoryId: categoryId,
        userId: userId,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
