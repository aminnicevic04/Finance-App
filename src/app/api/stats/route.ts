import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get("userId"));
    const timeFrame = searchParams.get("timeFrame");

    if (!userId || !timeFrame) {
      return NextResponse.json(
        { error: "Missing userId or timeFrame" },
        { status: 400 }
      );
    }

    let dateFilter;
    const now = new Date();
    if (timeFrame === "week") {
      dateFilter = { gte: new Date(now.setDate(now.getDate() - 7)) };
    } else if (timeFrame === "month") {
      dateFilter = { gte: new Date(now.setMonth(now.getMonth() - 1)) };
    } else if (timeFrame === "year") {
      dateFilter = { gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
    }

    const sales = await prisma.sale.findMany({
      where: {
        userId,
        date: dateFilter,
      },
      include: {
        product: true,
      },
    });

    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        date: dateFilter,
      },
    });

    const totalRevenue = sales.reduce(
      (acc, sale) => acc + sale.amount * sale.product.price,
      0
    );
    const averageRevenue = sales.length > 0 ? totalRevenue / sales.length : 0;

    return NextResponse.json({
      sales,
      expenses,
      totalRevenue,
      averageRevenue,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching stats" },
      { status: 500 }
    );
  }
}
