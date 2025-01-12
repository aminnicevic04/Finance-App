"use client";
import React, { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Product {
  name: string;
  price: number;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface Order {
  productName: string;
  description: string;
  orderDate: string;
  orderTime: string;
  customerName: string;
  contactNumber: string;
  orderItems: OrderItem[]; // Include order items
}

const TodayWork: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const today = format(new Date(), "yyyy-MM-dd");
  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const dayAfterTomorrow = format(addDays(new Date(), 2), "yyyy-MM-dd");

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const fetchOrdersForDate = async (date: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/getOrderByDate?date=${date}`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data: Order[] = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersForDate(format(selectedDate, "yyyy-MM-dd"));
  }, [selectedDate]);

  const formattedSelectedDate = format(selectedDate, "yyyy-MM-dd");
  const todayOrders = orders.filter((order) =>
    isSameDay(new Date(order.orderDate), selectedDate)
  );

  // Calculate the total price for each order (sum of product price * quantity)
  const calculateTotalPrice = (order: Order) => {
    return order.orderItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

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
      {loading && <p>Loading orders...</p>}
      {todayOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {todayOrders.map((order, index) => {
            const totalPrice = calculateTotalPrice(order); // Calculate the total price here
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-2 text-green-700">
                  {order.productName}
                </h2>
                <p className="text-gray-700 mb-4">{order.description}</p>
                <p className="text-gray-600">
                  <strong>Order Time:</strong> {order.orderTime}
                </p>
                {/* <p className="text-gray-600">
                  <strong>Customer Name:</strong> {order.customerName}
                </p>
                <p className="text-gray-600">
                  <strong>Contact Number:</strong> {order.contactNumber}
                </p> */}
                <p className="text-gray-600">
                  <strong>Total Price:</strong> ${totalPrice}
                </p>
                <div>
                  <h3 className="text-gray-700 font-semibold mt-2">
                    Order Items
                  </h3>
                  <ul>
                    {order.orderItems.map((item, idx) => (
                      <li key={idx}>
                        {item.product.name} (x{item.quantity}) - $
                        {item.product.price * item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600">No orders for the selected date.</p>
      )}
    </div>
  );
};

export default TodayWork;
