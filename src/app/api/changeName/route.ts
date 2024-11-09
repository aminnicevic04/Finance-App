import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PUT(req: Request) {
  const { name, id } = await req.json();

  try {
    const updatedProduct = await prisma.user.update({
      where: { id },
      data: {
        name,
      },
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating name:", error);
    return NextResponse.json(
      { error: "Failed to update name" },
      { status: 500 }
    );
  }
}
