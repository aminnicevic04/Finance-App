import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PUT(req: Request) {
  const { id, name, price, categoryId } = await req.json();

  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, price, categoryId },
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
