import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "User ne postoji" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = parseInt(session?.user?.id);
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));

    if (!userId || !month || !year) {
      return NextResponse.json(
        { error: "Missing userId, month or year" },
        { status: 400 }
      );
    }

    const startOfMonth = new Date(Date.UTC(year, month - 1, 1)); // Početak meseca u UTC
    const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59)); // Kraj meseca u UTC
    console.log(startOfMonth, endOfMonth);

    // Fetching sales data for the user in the given month
    const sales = await prisma.sale.findMany({
      where: {
        userId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        product: true,
      },
    });

    // Fetching expense categories for the user
    const expenseCategories = await prisma.expenseCategory.findMany({
      where: { userId },
      include: {
        expenses: {
          where: {
            date: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        },
      },
    });

    // Calculating total revenue and average revenue
    const totalRevenue = sales.reduce(
      (acc, sale) => acc + sale.amount * sale.product.price,
      0
    );
    const averageRevenue = sales.length > 0 ? totalRevenue / sales.length : 0;

    // Calculating total expense and average expense
    let totalExpense = 0;
    let averageExpense = undefined;
    const expenseSummary = expenseCategories.map((category) => {
      const categoryTotalExpense = category.expenses.reduce(
        (acc, expense) => acc + expense.amount,
        0
      );

      totalExpense += categoryTotalExpense;

      return {
        categoryName: category.name,
        totalExpense: categoryTotalExpense,
        averageExpense: category.expenses.length
          ? categoryTotalExpense / category.expenses.length
          : 0,
      };
    });

    averageExpense = totalExpense
      ? totalExpense / expenseSummary.length
      : undefined;

    return NextResponse.json({
      sales,
      expenseSummary,
      totalRevenue,
      averageRevenue,
      totalExpense,
      averageExpense,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Error fetching stats" },
      { status: 500 }
    );
  }
}
