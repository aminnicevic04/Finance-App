"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DynamicDoughnut = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Doughnut),
  { ssr: false }
);

interface Product {
  name: string;
  price: number;
}

interface Sale {
  product: Product;
  amount: number;
}

interface Expense {
  category: string;
  amount: number;
}

const StatsPage: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [timeFrame, setTimeFrame] = useState<"week" | "month" | "year">("week");
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [expenseData, setExpenseData] = useState<Expense[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageRevenue, setAverageRevenue] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [averageExpense, setAverageExpense] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/stats?userId=1&timeFrame=${timeFrame}`
        );
        const data = await response.json();
        setSalesData(data.sales);
        setExpenseData(data.expenses);
        setTotalRevenue(data.totalRevenue);
        setAverageRevenue(data.averageRevenue);
        setTotalExpense(data.totalExpense);
        setAverageExpense(data.averageExpense);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchData();
  }, [timeFrame]);

  // Group sales data by product name and sum their amounts
  const groupedSalesData = React.useMemo(() => {
    const saleCounts: Record<
      string,
      { product: Product; totalAmount: number }
    > = {};

    salesData.forEach((sale) => {
      const productName = sale.product.name;
      if (!saleCounts[productName]) {
        saleCounts[productName] = { product: sale.product, totalAmount: 0 };
      }
      saleCounts[productName].totalAmount += sale.amount;
    });

    return Object.values(saleCounts);
  }, [salesData]);

  // Group expense data by category and sum their amounts
  const groupedExpenseData = React.useMemo(() => {
    const expenseCounts: Record<
      string,
      { category: string; totalAmount: number }
    > = {};

    expenseData.forEach((expense) => {
      const categoryName = expense.category;
      if (!expenseCounts[categoryName]) {
        expenseCounts[categoryName] = {
          category: categoryName,
          totalAmount: 0,
        };
      }
      expenseCounts[categoryName].totalAmount += expense.amount;
    });

    return Object.values(expenseCounts);
  }, [expenseData]);

  // Process the grouped sales data for the Doughnut chart
  const doughnutSalesData = React.useMemo(() => {
    // Sort the products by sales count and take the top 4
    const sortedProducts = groupedSalesData
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 4);

    // Extract labels and data for the Doughnut chart
    const labels = sortedProducts.map(({ product }) => product.name);
    const data = sortedProducts.map(({ totalAmount }) => totalAmount);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
          ],
        },
      ],
    };
  }, [groupedSalesData]);

  // Process the grouped expense data for the Doughnut chart
  const doughnutExpenseData = React.useMemo(() => {
    // Sort the categories by expense amount and take the top 4
    const sortedCategories = groupedExpenseData
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 4);

    // Extract labels and data for the Doughnut chart
    const labels = sortedCategories.map(({ category }) => category);
    const data = sortedCategories.map(({ totalAmount }) => totalAmount);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
          ],
        },
      ],
    };
  }, [groupedExpenseData]);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Statistika prodaje i potrošnje
        </h1>
        <div className="mb-6 flex flex-wrap gap-2">
          {["week", "month", "year"].map((period) => (
            <button
              key={period}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                timeFrame === period
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setTimeFrame(period as "week" | "month" | "year")}
            >
              {period === "week"
                ? "Nedelja"
                : period === "month"
                ? "Mesec"
                : "Godina"}
            </button>
          ))}
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md lg:w-1/2">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Raspodela prodaje
            </h2>
            {isMounted && (
              <div className="w-full max-w-xs mx-auto">
                <DynamicDoughnut data={doughnutSalesData} />
              </div>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md lg:w-1/2">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Detalji prodaje
            </h2>
            <div className="overflow-y-auto max-h-64">
              <table className="w-full min-w-[300px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-2 px-4">Proizvod</th>
                    <th className="text-right py-2 px-4">Količina</th>
                    <th className="text-right py-2 px-4">Zarada</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedSalesData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{item.product.name}</td>
                      <td className="text-right py-2 px-4">
                        {item.totalAmount}
                      </td>
                      <td className="text-right py-2 px-4">
                        {item.totalAmount * item.product.price} RSD
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg shadow-md lg:w-1/2">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Raspodela potrošnje
            </h2>
            {isMounted && (
              <div className="w-full max-w-xs mx-auto">
                <DynamicDoughnut data={doughnutExpenseData} />
              </div>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md lg:w-1/2">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Detalji potrošnje
            </h2>
            <div className="overflow-y-auto max-h-64">
              <table className="w-full min-w-[300px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-2 px-4">Kategorija</th>
                    <th className="text-right py-2 px-4">Iznos</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedExpenseData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{item.category}</td>
                      <td className="text-right py-2 px-4">
                        {item.totalAmount} RSD
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Dodatna Statistika
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <p className="text-gray-700">
                <strong>Ukupna zarada:</strong> {totalRevenue} RSD
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <p className="text-gray-700">
                <strong>Prosečna zarada po proizvodu:</strong>{" "}
                {averageRevenue.toFixed(2)} RSD
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <p className="text-gray-700">
                <strong>Ukupna potrošnja:</strong> {totalExpense} RSD
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <p className="text-gray-700">
                <strong>Prosečna potrošnja po kategoriji:</strong>{" "}
                {averageExpense !== undefined
                  ? averageExpense.toFixed(2)
                  : "N/A"}{" "}
                RSD
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
