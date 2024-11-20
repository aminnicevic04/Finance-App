import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get("userId"));
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));

    if (!userId || !month || !year) {
      return NextResponse.json(
        { error: "Missing userId, month or year" },
        { status: 400 }
      );
    }

    const startOfMonth = new Date(year, month - 1, 1); // month is 0-indexed
    const endOfMonth = new Date(year, month, 0); // Get the last day of the month

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
    return NextResponse.json(
      { error: "Error fetching stats" },
      { status: 500 }
    );
  }
}
