"use client";
import React, { useState } from "react";

interface Order {
  productName: string;
  description: string;
  orderDate: string;
  orderTime: string;
  customerName: string;
  contactNumber: string;
  price: number;
}

const OrderPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<
    "orderDate" | "productName" | "customerName"
  >("orderDate");

  // Mock data
  const orders: Order[] = [
    {
      productName: "Product 1",
      description: "Description for product 1",
      orderDate: "2023-10-01",
      orderTime: "14:00",
      customerName: "John Doe",
      contactNumber: "123-456-7890",
      price: 100,
    },
    {
      productName: "Product 2",
      description: "Description for product 2",
      orderDate: "2023-10-02",
      orderTime: "15:00",
      customerName: "Jane Smith",
      contactNumber: "098-765-4321",
      price: 150,
    },
    {
      productName: "Product 3",
      description: "Description for product 3",
      orderDate: "2023-10-03",
      orderTime: "16:00",
      customerName: "Alice Johnson",
      contactNumber: "111-222-3333",
      price: 200,
    },
    {
      productName: "Product 4",
      description: "Description for product 4",
      orderDate: "2023-10-04",
      orderTime: "17:00",
      customerName: "Bob Brown",
      contactNumber: "444-555-6666",
      price: 250,
    },
    {
      productName: "Product 5",
      description: "Description for product 5",
      orderDate: "2023-10-05",
      orderTime: "18:00",
      customerName: "Charlie Davis",
      contactNumber: "777-888-9999",
      price: 300,
    },
  ];

  const filteredOrders = orders
    .filter((order) =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortField].localeCompare(b[sortField]);
      } else {
        return b[sortField].localeCompare(a[sortField]);
      }
    });

  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const date = order.orderDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce(
    (acc, order) => acc + order.price,
    0
  );

  return (
    <div className="p-6 pl-24 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Order Page</h1>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by customer name"
            className="p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="ml-4 p-2 bg-green-500 text-white rounded"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            Sort by {sortField} (
            {sortOrder === "asc" ? "Ascending" : "Descending"})
          </button>
          <select
            className="ml-4 p-2 border border-gray-300 rounded"
            value={sortField}
            onChange={(e) =>
              setSortField(
                e.target.value as "orderDate" | "productName" | "customerName"
              )
            }
          >
            <option value="orderDate">Order Date</option>
            <option value="productName">Product Name</option>
            <option value="customerName">Customer Name</option>
          </select>
        </div>
        <div className="flex items-center">
          <span className="mr-4">Total Orders: {totalOrders}</span>
          <span>Expected Revenue: {totalRevenue} rsd</span>
        </div>
      </div>
      {Object.keys(groupedOrders).map((date) => (
        <div key={date} className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 text-green-700">{date}</h2>
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Product Name</th>
                <th className="py-2 px-4 border-b text-left">Description</th>
                <th className="py-2 px-4 border-b text-left">Order Time</th>
                <th className="py-2 px-4 border-b text-left">Customer Name</th>
                <th className="py-2 px-4 border-b text-left">Contact Number</th>
                <th className="py-2 px-4 border-b text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {groupedOrders[date].map((order, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{order.productName}</td>
                  <td className="py-2 px-4 border-b">{order.description}</td>
                  <td className="py-2 px-4 border-b">{order.orderTime}</td>
                  <td className="py-2 px-4 border-b">{order.customerName}</td>
                  <td className="py-2 px-4 border-b">{order.contactNumber}</td>
                  <td className="py-2 px-4 border-b">{order.price} rsd</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default OrderPage;
