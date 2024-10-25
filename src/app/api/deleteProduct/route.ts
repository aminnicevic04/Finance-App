import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function DELETE(req: Request) {
  const { id } = await req.json();

  try {
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({}, { status: 204 }); // No content
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
