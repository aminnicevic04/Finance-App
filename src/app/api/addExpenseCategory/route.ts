import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

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

    const newProduct = await prisma.expenseCategory.create({
      data: {
        name: categoryName,
        userId: userIdd,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
