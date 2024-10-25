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

const StatsPage: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [timeFrame, setTimeFrame] = useState<"week" | "month" | "year">("week");
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageRevenue, setAverageRevenue] = useState(0);

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
        setTotalRevenue(data.totalRevenue);
        setAverageRevenue(data.averageRevenue);
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

  // Process the grouped sales data for the Doughnut chart
  const doughnutData = React.useMemo(() => {
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

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Statistika prodaje
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
                <DynamicDoughnut data={doughnutData} />
              </div>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md lg:w-1/2">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Detalji prodaje
            </h2>
            <div className="overflow-x-auto">
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
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Dodatna Statistika
          </h2>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2">
              <p className="text-gray-700">
                <strong>Ukupna zarada:</strong> {totalRevenue} RSD
              </p>
            </div>
            <div className="lg:w-1/2">
              <p className="text-gray-700">
                <strong>Prosečna zarada po proizvodu:</strong>{" "}
                {averageRevenue.toFixed(2)} RSD
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
