// File: /app/api/orders/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const dateParam = url.searchParams.get("date"); // e.g., "2025-01-12"

  console.log("Received date parameter:", dateParam);

  if (!dateParam) {
    return new Response("Date query parameter is required", { status: 400 });
  }

  const date = new Date(dateParam); // Convert the string date to a Date object
  date.setHours(0, 0, 0, 0); // Set the time to midnight to avoid time comparison issues

  try {
    const orders = await prisma.order.findMany({
      where: {
        orderDate: {
          gte: date, // Orders on or after midnight of the selected date
          lt: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Orders before the next day
        },
      },
      include: {
        orderItems: {
          include: {
            product: true, // Include product details with each order item
          },
        },
      },
    });

    return new Response(JSON.stringify(orders), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
