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
  const [sortField, setSortField] = useState<"orderDate" | "orderTime">(
    "orderDate"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedDescription, setSelectedDescription] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  const ordersPerPage = 16;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/getOrders");
        if (!res.ok) {
          throw new Error("Greška pri preuzimanju porudžbina");
        }
        const data: Order[] = await res.json();
        setOrders(data);
      } catch (err) {
        setError("Neuspešno učitavanje porudžbina");
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

  const handleSort = (field: "orderDate" | "orderTime") => {
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

  const truncateDescription = (description: string) => {
    const words = description.split(" ");
    if (words.length > 6) {
      return words.slice(0, 6).join(" ") + "...";
    }
    return description;
  };

  // Get current orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) return <div>Učitavanje...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 md:pl-24 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Porudžbine</h1>

      <div className="mb-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0 w-full md:w-auto">
          <input
            type="text"
            placeholder="Pretraži po opisu porudžbine"
            className="p-2 border border-gray-300 rounded w-full md:w-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <span className="mr-4">Sortiraj po:</span>
          <button
            className="ml-2 p-2 bg-green-500 text-white rounded"
            onClick={() => handleSort("orderDate")}
          >
            Datum ({sortOrder === "asc" ? "Rastuće" : "Opadajuće"})
          </button>
          <button
            className="ml-2 p-2 bg-green-500 text-white rounded"
            onClick={() => handleSort("orderTime")}
          >
            Vreme ({sortOrder === "asc" ? "Rastuće" : "Opadajuće"})
          </button>
        </div>
      </div>

      {currentOrders.length === 0 ? (
        <p>Nema pronađenih porudžbina.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentOrders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">
                  Porudžbina br. {order.id}
                </h2>
                <p className="text-gray-700">
                  <strong>Datum:</strong> {formatOrderDate(order.orderDate)}
                </p>
                <p className="text-gray-700">
                  <strong>Vreme:</strong> {order.orderTime}
                </p>
                <p className="text-gray-700">
                  <strong>Opis:</strong>{" "}
                  {truncateDescription(order.description)}
                  {order.description.split(" ").length > 6 && (
                    <button
                      className="text-blue-500 ml-2"
                      onClick={() => setSelectedDescription(order.description)}
                    >
                      Pročitaj više
                    </button>
                  )}
                </p>
                <p className="text-gray-700">
                  <strong>Ukupna cena:</strong> {calculateTotalOrderCost(order)}{" "}
                  rsd
                </p>
              </div>
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Stavke:</h3>
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="py-2 border text-center">Naziv</th>
                      <th className="py-2 border text-center">Količina</th>
                      <th className="py-2 border text-center">Cena</th>
                      <th className="py-2 border text-center">Ukupno</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item, index) => (
                      <tr key={index} className="text-gray-600">
                        <td className="py-2 border text-center">
                          {item.product.name}
                        </td>
                        <td className="py-2 border text-center">
                          {item.quantity}
                        </td>
                        <td className="py-2 border text-center">
                          {item.product.price} rsd
                        </td>
                        <td className="py-2 border text-center">
                          {item.product.price * item.quantity} rsd
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-6">
        <nav>
          <ul className="flex list-none">
            {Array.from(
              { length: Math.ceil(sortedOrders.length / ordersPerPage) },
              (_, index) => (
                <li key={index} className="mx-1">
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === index + 1
                        ? "bg-green-500 text-white"
                        : "bg-white text-green-500 border border-green-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>

      {selectedDescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Opis porudžbine</h2>
            <p className="text-gray-700 mb-4">{selectedDescription}</p>
            <button
              className="bg-green-500 text-white p-2 rounded"
              onClick={() => setSelectedDescription(null)}
            >
              Zatvori
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
