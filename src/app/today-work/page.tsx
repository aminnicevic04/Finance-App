"use client";
import React, { useState } from "react";
import { format, addDays } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Order {
  productName: string;
  description: string;
  orderDate: string;
  orderTime: string;
  customerName: string;
  contactNumber: string;
  price: number;
}

const TodayWork: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const today = format(new Date(), "yyyy-MM-dd");
  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const dayAfterTomorrow = format(addDays(new Date(), 2), "yyyy-MM-dd");

  const orders: Order[] = [
    {
      productName: "Product 1",
      description: "Description for product 1",
      orderDate: today,
      orderTime: "14:00",
      customerName: "John Doe",
      contactNumber: "123-456-7890",
      price: 100,
    },
    {
      productName: "Product 2",
      description: "Description for product 2",
      orderDate: tomorrow,
      orderTime: "15:00",
      customerName: "Jane Smith",
      contactNumber: "098-765-4321",
      price: 150,
    },
    {
      productName: "Product 3",
      description: "Description for product 3",
      orderDate: dayAfterTomorrow,
      orderTime: "16:00",
      customerName: "Alice Johnson",
      contactNumber: "111-222-3333",
      price: 200,
    },
    {
      productName: "Product 3",
      description: "Description for product 3",
      orderDate: dayAfterTomorrow,
      orderTime: "16:00",
      customerName: "Alice Johnson",
      contactNumber: "111-222-3333",
      price: 200,
    },
    {
      productName: "Product 3",
      description: "Description for product 3",
      orderDate: dayAfterTomorrow,
      orderTime: "16:00",
      customerName: "Alice Johnson",
      contactNumber: "111-222-3333",
      price: 200,
    },
    {
      productName: "Product 3",
      description: "Description for product 3",
      orderDate: dayAfterTomorrow,
      orderTime: "16:00",
      customerName: "Alice Johnson",
      contactNumber: "111-222-3333",
      price: 200,
    },
    {
      productName: "Product 3",
      description: "Description for product 3",
      orderDate: dayAfterTomorrow,
      orderTime: "16:00",
      customerName: "Alice Johnson",
      contactNumber: "111-222-3333",
      price: 200,
    },
    {
      productName: "Product 3",
      description: "Description for product 3",
      orderDate: dayAfterTomorrow,
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

  const formattedSelectedDate = format(selectedDate, "yyyy-MM-dd");
  const todayOrders = orders.filter(
    (order) => order.orderDate === formattedSelectedDate
  );

  return (
    <div className="p-6 pl-24 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Daily Work</h1>
      <div className="mb-4 flex items-center space-x-4">
        <button
          className="p-2 bg-green-500 text-white rounded"
          onClick={() => setSelectedDate(new Date())}
        >
          Today
        </button>
        <button
          className="p-2 bg-green-500 text-white rounded"
          onClick={() => setSelectedDate(addDays(new Date(), 1))}
        >
          Tomorrow
        </button>
        <button
          className="p-2 bg-green-500 text-white rounded"
          onClick={() => setSelectedDate(addDays(new Date(), 2))}
        >
          Day After Tomorrow
        </button>
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => date && setSelectedDate(date)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      {todayOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {todayOrders.map((order, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-2 text-green-700">
                {order.productName}
              </h2>
              <p className="text-gray-700 mb-4">{order.description}</p>
              <p className="text-gray-600">
                <strong>Order Time:</strong> {order.orderTime}
              </p>
              <p className="text-gray-600">
                <strong>Customer Name:</strong> {order.customerName}
              </p>
              <p className="text-gray-600">
                <strong>Contact Number:</strong> {order.contactNumber}
              </p>
              <p className="text-gray-600">
                <strong>Price:</strong> ${order.price}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No orders for the selected date.</p>
      )}
    </div>
  );
};

export default TodayWork;
