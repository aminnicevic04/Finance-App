import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
const prisma = new PrismaClient();

export async function PUT(req: Request) {
  const { name } = await req.json();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({
      error: "User ne postoji",
    });
  }

  const id = parseInt(session?.user?.id);

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
