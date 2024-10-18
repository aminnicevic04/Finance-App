"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DynamicDoughnut = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Doughnut),
  { ssr: false }
);

const StatsPage: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [timeFrame, setTimeFrame] = useState<"week" | "month" | "year">("week");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const doughnutData = {
    labels: ["Torta", "Kolač", "Sladoled", "Kafa"],
    datasets: [
      {
        data: [12, 19, 3, 5],
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
        ],
      },
    ],
  };

  const salesData = [
    { product: "Torta", quantity: 12, revenue: 1200 },
    { product: "Kolač", quantity: 19, revenue: 950 },
    { product: "Sladoled", quantity: 3, revenue: 150 },
    { product: "Kafa", quantity: 5, revenue: 250 },
  ];

  const totalRevenue = salesData.reduce((acc, item) => acc + item.revenue, 0);
  const averageRevenue = totalRevenue / salesData.length;

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
                  {salesData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{item.product}</td>
                      <td className="text-right py-2 px-4">{item.quantity}</td>
                      <td className="text-right py-2 px-4">
                        {item.revenue} RSD
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
