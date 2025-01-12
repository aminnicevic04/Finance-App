"use client";
import React, { useEffect, useState } from "react";

interface OrderItem {
  product: {
    name: string;
    price: number;
  };
  quantity: number;
}

interface Order {
  id: number;
  description: string;
  orderDate: string;
  orderTime: string;
  orderItems: OrderItem[];
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // For filtering by order description
  const [sortField, setSortField] = useState<
    "orderDate" | "description" | "orderTime"
  >("orderDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/getOrders");
        if (!res.ok) {
          throw new Error("Error fetching orders");
        }
        const data: Order[] = await res.json();
        setOrders(data);
      } catch (err) {
        setError("Failed to load orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on search term (order description)
  const filteredOrders = orders.filter((order) =>
    order.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort orders based on the selected field and order
  const sortedOrders = filteredOrders.sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  // Calculate the total cost for each order
  const calculateTotalOrderCost = (order: Order) => {
    return order.orderItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const handleSort = (field: "orderDate" | "description" | "orderTime") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Manually format the order date (YYYY-MM-DD)
  const formatOrderDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Add leading zero
    const day = ("0" + date.getDate()).slice(-2); // Add leading zero
    return `${year}-${month}-${day}`;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 pl-24 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Orders</h1>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by order description"
            className="p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <span className="mr-4">Sort by:</span>
          <button
            className="ml-2 p-2 bg-green-500 text-white rounded"
            onClick={() => handleSort("orderDate")}
          >
            Order Date ({sortOrder === "asc" ? "Ascending" : "Descending"})
          </button>
          <button
            className="ml-2 p-2 bg-green-500 text-white rounded"
            onClick={() => handleSort("description")}
          >
            Description ({sortOrder === "asc" ? "Ascending" : "Descending"})
          </button>
          <button
            className="ml-2 p-2 bg-green-500 text-white rounded"
            onClick={() => handleSort("orderTime")}
          >
            Order Time ({sortOrder === "asc" ? "Ascending" : "Descending"})
          </button>
        </div>
      </div>

      {sortedOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        sortedOrders.map((order) => (
          <div key={order.id} className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">{order.description}</h2>
            <p>
              <strong>Order Date:</strong> {formatOrderDate(order.orderDate)}{" "}
              {/* Format here */}
            </p>
            <p>
              <strong>Order Time:</strong> {order.orderTime}
            </p>
            <p>
              <strong>Total Order Cost:</strong>{" "}
              {calculateTotalOrderCost(order)} rsd
            </p>
            <div className="mt-4">
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">
                      Product Name
                    </th>
                    <th className="py-2 px-4 border-b text-left">Quantity</th>
                    <th className="py-2 px-4 border-b text-left">Price</th>
                    <th className="py-2 px-4 border-b text-left">
                      Total Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b">
                        {item.product.name}
                      </td>
                      <td className="py-2 px-4 border-b">{item.quantity}</td>
                      <td className="py-2 px-4 border-b">
                        {item.product.price} rsd
                      </td>
                      <td className="py-2 px-4 border-b">
                        {item.product.price * item.quantity} rsd
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersPage;
