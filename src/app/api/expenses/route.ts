import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { use } from "react";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({
      error: "User ne postoji",
    });
  }

  const userId = parseInt(session?.user?.id);
  try {
    const { amount, expenseCategoryId } = await request.json();

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Unesite validan iznos troška." },
        { status: 400 }
      );
    }

    // Fetch the current totalTrosak of the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totalTrosak: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate the new totalTrosak after the expense
    const newTotalTrosak = user.totalTrosak - amount;

    // Create the expense
    const newExpense = await prisma.expense.create({
      data: {
        userId,
        amount,
        expenseCategoryId,
      },
    });

    if (user.totalTrosak > 0 && newTotalTrosak < 0) {
      // Send notification if totalTrosak just reached 0
      await prisma.notification.create({
        data: {
          userId,
          message: "Prešli ste limit troškova za ovaj mesec.",
          type: "bad",
        },
      });
    }
    if (user.totalTrosak > 0) {
      // Only update totalTrosak if it has not already reached 0

      // Update the user's totalTrosak only if it hasn't been updated yet
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalTrosak: newTotalTrosak <= 0 ? 0 : newTotalTrosak,
        },
      });
    }

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Došlo je do greške prilikom čuvanja troška." },
      { status: 500 }
    );
  }
}
