import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { error } from "console";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({
      error: "User ne postoji",
    });
  }

  const userIdd = parseInt(session?.user?.id);
  try {
    const { categoryName } = await req.json();

    const newProduct = await prisma.category.create({
      data: {
        name: categoryName,
        userId: userIdd,
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
