import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Handler za POST zahtev za kreiranje novog troška
export async function POST(request: Request) {
  try {
    // Parsiraj podatke iz tela zahteva
    const { amount, description } = await request.json();

    // Validacija podataka
    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Unesite validan iznos troška." },
        { status: 400 }
      );
    }

    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: "Unesite opis troška." },
        { status: 400 }
      );
    }

    const userId = 1;

    // Kreiranje novog zapisa troška u bazi
    const newExpense = await prisma.expense.create({
      data: {
        userId,
        amount,
        description,
      },
    });

    // Vraćanje uspešnog odgovora sa novim troškom
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Došlo je do greške prilikom čuvanja troška." },
      { status: 500 }
    );
  }
}
