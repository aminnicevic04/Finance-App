import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { amount, expenseCategoryId, userId } = await request.json();

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Unesite validan iznos troška." },
        { status: 400 }
      );
    }

    const newExpense = await prisma.expense.create({
      data: {
        userId,
        amount,
        expenseCategoryId,
      },
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Došlo je do greške prilikom čuvanja troška." },
      { status: 500 }
    );
  }
}
