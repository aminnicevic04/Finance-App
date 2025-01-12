import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({
      error: "User not authenticated",
    });
  }

  const userId = parseInt(session?.user?.id);

  try {
    // Fetch all orders and their associated order items and product details for the authenticated user
    const orders = await prisma.order.findMany({
      where: {
        userId: userId, // Filter orders for the authenticated user
      },
      include: {
        orderItems: {
          include: {
            product: true, // Include product details for each order item
          },
        },
      },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
