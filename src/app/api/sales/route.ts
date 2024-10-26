import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const salesData = await request.json();

  // Assuming you have a user ID to associate the sales with
  const userId = 1; // Replace with the actual user ID

  try {
    const sales = await Promise.all(
      salesData.map(
        async (sale: { id: number; kolicina: number; prodId: number }) => {
          const { id, kolicina, prodId } = sale;

          // You can define the amount based on your logic; this is just an example
          const amount = kolicina; // Adjust this based on the product's price
          const productId = prodId;

          return await prisma.sale.create({
            data: {
              user: { connect: { id: userId } },
              amount,
              description: `Prodaja artikla ID: ${id}`,
              product: { connect: { id: productId } },
            },
          });
        }
      )
    );

    return NextResponse.json(sales, { status: 201 });
  } catch (error) {
    console.error("Error saving sales:", error);
    return NextResponse.json(
      { error: "Failed to save sales data" },
      { status: 500 }
    );
  }
}
