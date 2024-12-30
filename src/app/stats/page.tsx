"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import Select from "react-select";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const DynamicDoughnut = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Doughnut),
  { ssr: false }
);

const DynamicBar = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Bar),
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
  categoryName: string;
  totalExpense: number;
}

const StatsPage: React.FC = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/stats");
    },
  });
  const [isMounted, setIsMounted] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [expenseSummary, setexpenseSummary] = useState<Expense[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageRevenue, setAverageRevenue] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [averageExpense, setAverageExpense] = useState<number | undefined>(
    undefined
  );

  const [genderData, setGenderData] = useState<any>([]);
  const [ageGroupData, setAgeGroupData] = useState<any>([]);
  const [cityData, setCityData] = useState<any>([]);
  const [ageGroupSpending, setAgeGroupSpending] = useState({
    labels: ["18-25", "26-35", "36-45", "46+"],
    datasets: [
      {
        data: [3500, 7800, 12500, 9200],
        backgroundColor: [
          "rgba(75, 192, 192, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(255, 99, 132, 0.8)",
        ],
      },
    ],
  });

  const years = [
    { value: 2023, label: "2023" },
    { value: 2024, label: "2024" },
  ];
  const months = [
    { value: 0, label: "Januar" },
    { value: 1, label: "Februar" },
    { value: 2, label: "Mart" },
    { value: 3, label: "April" },
    { value: 4, label: "Maj" },
    { value: 5, label: "Jun" },
    { value: 6, label: "Jul" },
    { value: 7, label: "Avgust" },
    { value: 8, label: "Septembar" },
    { value: 9, label: "Oktobar" },
    { value: 10, label: "Novembar" },
    { value: 11, label: "Decembar" },
  ];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    setSelectedMonth(currentDate.getMonth());
    setSelectedYear(currentDate.getFullYear());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedMonth === null || selectedYear === null) return;
      try {
        console.log("Sending request for", selectedMonth + 1, selectedYear);

        const response = await fetch(
          `/api/stats?month=${selectedMonth + 1}&year=${selectedYear}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setSalesData(data.sales);
        setexpenseSummary(data.expenseSummary);
        setTotalRevenue(data.totalRevenue);
        setAverageRevenue(data.averageRevenue);
        setTotalExpense(data.totalExpense);
        setAverageExpense(data.averageExpense);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

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

  const doughnutSalesData = React.useMemo(() => {
    const sortedProducts = groupedSalesData
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 4);

    const labels = sortedProducts.map(({ product }) => product.name);
    const data = sortedProducts.map(({ totalAmount }) => totalAmount);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "rgba(75, 192, 192, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(255, 99, 132, 0.8)",
          ],
        },
      ],
    };
  }, [groupedSalesData]);

  const doughnutExpenseData = React.useMemo(() => {
    const sortedCategories = expenseSummary
      .sort((a, b) => b.totalExpense - a.totalExpense)
      .slice(0, 4);

    const labels = sortedCategories.map(({ categoryName }) => categoryName);
    const data = sortedCategories.map(({ totalExpense }) => totalExpense);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "rgba(75, 192, 192, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(255, 99, 132, 0.8)",
          ],
        },
      ],
    };
  }, [expenseSummary]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/kupci");
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Podaci nisu u očekivanom formatu");
        }

        const genderStats = data.reduce((acc: any, kupac: any) => {
          if (kupac.pol) {
            acc[kupac.pol] = (acc[kupac.pol] || 0) + 1;
          }
          return acc;
        }, {});

        setGenderData({
          labels: Object.keys(genderStats),
          datasets: [
            {
              data: Object.values(genderStats),
              backgroundColor: ["#FF6384", "#36A2EB"],
            },
          ],
        });

        const ageGroupStats = data.reduce((acc: any, kupac: any) => {
          if (kupac.starosnaGrupa) {
            acc[kupac.starosnaGrupa] = (acc[kupac.starosnaGrupa] || 0) + 1;
          }
          return acc;
        }, {});

        setAgeGroupData({
          labels: Object.keys(ageGroupStats),
          datasets: [
            {
              label: "Starosne grupe",
              data: Object.values(ageGroupStats),
              backgroundColor: [
                "rgba(75, 192, 192, 0.8)",
                "rgba(54, 162, 235, 0.8)",
                "rgba(255, 206, 86, 0.8)",
                "rgba(255, 99, 132, 0.8)",
              ],
            },
          ],
        });

        const cityStats = data.reduce((acc: any, kupac: any) => {
          if (kupac.Grad) {
            acc[kupac.Grad] = (acc[kupac.Grad] || 0) + 1;
          }
          return acc;
        }, {});

        setCityData({
          labels: Object.keys(cityStats),
          datasets: [
            {
              label: "Gradovi",
              data: Object.values(cityStats),
              backgroundColor: [
                "rgba(75, 192, 192, 0.8)",
                "rgba(54, 162, 235, 0.8)",
                "rgba(255, 206, 86, 0.8)",
                "rgba(255, 99, 132, 0.8)",
              ],
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        toast.error("Došlo je do greške pri učitavanju podataka.");
        console.error("Error fetching kupci data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Statistika prodaje i potrošnje
        </h1>

        {/* Year/Month Selection */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Select
            options={years}
            value={
              selectedYear
                ? { value: selectedYear, label: selectedYear.toString() }
                : null
            }
            onChange={(e) => setSelectedYear(e ? e.value : null)}
            className="w-48"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "9999px",
                borderColor: "rgba(34, 139, 34, 0.8)",
                "&:hover": { borderColor: "rgba(34, 139, 34, 1)" },
              }),
              singleValue: (base) => ({
                ...base,
                color: "rgba(34, 139, 34, 1)",
              }),
            }}
          />
          <Select
            options={months}
            value={
              selectedMonth !== null
                ? { value: selectedMonth, label: months[selectedMonth].label }
                : null
            }
            onChange={(e) => setSelectedMonth(e ? e.value : null)}
            className="w-48"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "9999px",
                borderColor: "rgba(34, 139, 34, 0.8)",
                "&:hover": { borderColor: "rgba(34, 139, 34, 1)" },
              }),
              singleValue: (base) => ({
                ...base,
                color: "rgba(34, 139, 34, 1)",
              }),
            }}
          />
        </div>

        {/* Sales Distribution */}
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

        {/* Expense Distribution */}
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
                  {expenseSummary.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{item.categoryName}</td>
                      <td className="text-right py-2 px-4">
                        {item.totalExpense} RSD
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Additional Statistics */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Dodatna Statistika
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <p className="text-green-700">
                <strong>Ukupna zarada:</strong> {totalRevenue} RSD
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <p className="text-green-700">
                <strong>Prosečna zarada po proizvodu:</strong>{" "}
                {averageRevenue.toFixed(2)} RSD
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <p className="text-green-700">
                <strong>Ukupna potrošnja:</strong> {totalExpense} RSD
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <p className="text-green-700">
                <strong>Prosečna potrošnja po kategoriji:</strong>{" "}
                {averageExpense !== undefined
                  ? averageExpense.toFixed(2)
                  : "N/A"}{" "}
                RSD
              </p>
            </div>
          </div>
        </div>

        {/* Marketing Statistics */}
        <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Marketing Statistika
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gender Distribution */}
            <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">
                Distribucija po polu
              </h3>
              {isMounted && (
                <>
                  <div className="w-full max-w-xs mx-auto mb-6">
                    <DynamicDoughnut
                      data={genderData}
                      options={{
                        plugins: {
                          legend: { position: "bottom" },
                        },
                      }}
                    />
                  </div>
                  <div className="overflow-y-auto max-h-64">
                    <table className="w-full min-w-[300px]">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="text-left py-2 px-4">Pol</th>
                          <th className="text-right py-2 px-4">Broj kupaca</th>
                          <th className="text-right py-2 px-4">Procenat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {genderData.labels?.map(
                          (label: string, index: number) => {
                            const total = genderData.datasets[0].data.reduce(
                              (a: number, b: number) => a + b,
                              0
                            );
                            const percentage = (
                              (genderData.datasets[0].data[index] / total) *
                              100
                            ).toFixed(1);
                            return (
                              <tr key={index} className="border-b">
                                <td className="py-2 px-4">{label}</td>
                                <td className="text-right py-2 px-4">
                                  {genderData.datasets[0].data[index]}
                                </td>
                                <td className="text-right py-2 px-4">
                                  {percentage}%
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* Age Groups */}
            <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">
                Starosne grupe
              </h3>
              {isMounted && (
                <>
                  <div className="w-full max-w-xs mx-auto mb-6">
                    <DynamicDoughnut
                      data={ageGroupData}
                      options={{
                        plugins: {
                          legend: { position: "bottom" },
                        },
                      }}
                    />
                  </div>
                  <div className="overflow-y-auto max-h-64">
                    <table className="w-full min-w-[300px]">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="text-left py-2 px-4">
                            Starosna grupa
                          </th>
                          <th className="text-right py-2 px-4">Broj kupaca</th>
                          <th className="text-right py-2 px-4">Procenat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ageGroupData.labels?.map(
                          (label: string, index: number) => {
                            const total = ageGroupData.datasets[0].data.reduce(
                              (a: number, b: number) => a + b,
                              0
                            );
                            const percentage = (
                              (ageGroupData.datasets[0].data[index] / total) *
                              100
                            ).toFixed(1);
                            return (
                              <tr key={index} className="border-b">
                                <td className="py-2 px-4">{label}</td>
                                <td className="text-right py-2 px-4">
                                  {ageGroupData.datasets[0].data[index]}
                                </td>
                                <td className="text-right py-2 px-4">
                                  {percentage}%
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* Average Spending by Age */}
            <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">
                Prosečna potrošačka korpa po starosti
              </h3>
              {isMounted && (
                <>
                  <div className="w-full max-w-xs mx-auto mb-6">
                    <DynamicDoughnut
                      data={ageGroupSpending}
                      options={{
                        plugins: {
                          legend: { position: "bottom" },
                          tooltip: {
                            callbacks: {
                              label: (context: any) =>
                                `${
                                  context.label
                                }: ${context.raw.toLocaleString()} RSD`,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="overflow-y-auto max-h-64">
                    <table className="w-full min-w-[300px]">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="text-left py-2 px-4">
                            Starosna grupa
                          </th>
                          <th className="text-right py-2 px-4">
                            Prosečna potrošnja
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {ageGroupSpending.labels?.map(
                          (label: string, index: number) => (
                            <tr key={index} className="border-b">
                              <td className="py-2 px-4">{label}</td>
                              <td className="text-right py-2 px-4">
                                {ageGroupSpending.datasets[0].data[
                                  index
                                ].toLocaleString()}{" "}
                                RSD
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* City Distribution */}
            <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">
                Distribucija po gradovima
              </h3>
              {isMounted && (
                <>
                  <div className="w-full max-w-xs mx-auto mb-6">
                    <DynamicDoughnut
                      data={cityData}
                      options={{
                        plugins: {
                          legend: { position: "bottom" },
                        },
                      }}
                    />
                  </div>
                  <div className="overflow-y-auto max-h-64">
                    <table className="w-full min-w-[300px]">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="text-left py-2 px-4">Grad</th>
                          <th className="text-right py-2 px-4">Broj kupaca</th>
                          <th className="text-right py-2 px-4">Procenat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cityData.labels?.map(
                          (label: string, index: number) => {
                            const total = cityData.datasets[0].data.reduce(
                              (a: number, b: number) => a + b,
                              0
                            );
                            const percentage = (
                              (cityData.datasets[0].data[index] / total) *
                              100
                            ).toFixed(1);
                            return (
                              <tr key={index} className="border-b">
                                <td className="py-2 px-4">{label}</td>
                                <td className="text-right py-2 px-4">
                                  {cityData.datasets[0].data[index]}
                                </td>
                                <td className="text-right py-2 px-4">
                                  {percentage}%
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
