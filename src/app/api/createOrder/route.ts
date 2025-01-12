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
    const { products, description, orderDate, orderTime } = await req.json();

    console.log("Received data:", {
      products,
      description,
      orderDate,
      orderTime,
    });

    // Kreiraj novu porudžbinu
    const newOrder = await prisma.order.create({
      data: {
        description,
        orderDate: new Date(orderDate),
        orderTime: orderTime,
        userId: userIdd,
        orderItems: {
          create: products.map((product: { id: number; kolicina: number }) => ({
            productId: product.id,
            quantity: product.kolicina,
          })),
        },
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
