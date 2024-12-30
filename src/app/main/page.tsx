import React, { useState, KeyboardEvent, ChangeEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/");
    },
  });
  const [trosak, setTrosak] = useState("");
  const [showTrosakPopup, setShowTrosakPopup] = useState(false);
  const [showProdajaPopup, setShowProdajaPopup] = useState(false);
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [showAdditionalInfoPopup, setShowAdditionalInfoPopup] = useState(false);
  const [prodatiArtikli, setProdatiArtikli] = useState<
    { id: number; kolicina: number; prodId: number }[]
  >([]);
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<MenuSection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [orderDescription, setOrderDescription] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [orderTime, setOrderTime] = useState("");

  const [pol, setPol] = useState<string>("");
  const [grad, setGrad] = useState<string>("");
  const [starosnaGrupa, setStarosnaGrupa] = useState<string>("");

  const starosneGrupe = ["0-18", "19-25", "26-35", "36-45", "46-60", "60+"];

  interface MenuItem {
    id: number;
    name: string;
    price: number;
  }

  interface MenuSection {
    id: number;
    name: string;
    products: MenuItem[];
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setMenuSections(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getExpenseCategories");
        const data = await response.json();
        setExpenseCategories(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTrosakSubmit = () => {
    if (Number(trosak) <= 0) {
      toast.error("Unesite validan iznos troška!");
      return;
    }
    setShowTrosakPopup(true);
  };

  const handleTrosakPotvrda = async (expenseCategoryId: number) => {
    try {
      const expenseData = {
        amount: Number(trosak),
        expenseCategoryId,
        userId: 1,
      };

      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        throw new Error("Došlo je do greške prilikom čuvanja troška!");
      }

      const result = await response.json();
      toast.success("Trošak je uspešno sačuvan!");
      console.log("Saved expense data:", result);

      setTrosak("");
      setShowTrosakPopup(false);
    } catch (error) {
      toast.error("Došlo je do greške prilikom čuvanja troška!");
      console.error("Error saving expense:", error);
    }
  };

  const handleProdajaSubmit = () => {
    setShowProdajaPopup(true);
  };

  const handleOrderSubmit = () => {
    setShowOrderPopup(true);
  };

  const handleOrderPotvrda = async () => {
    try {
      const orderData = {
        products: prodatiArtikli,
        description: orderDescription,
        orderDate: orderDate,
        orderTime: orderTime,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Došlo je do greške prilikom čuvanja porudžbine!");
      }

      toast.success("Porudžbina je uspešno sačuvana!");
      setShowOrderPopup(false);
      setProdatiArtikli([]);
      setOrderDescription("");
      setOrderDate("");
      setOrderTime("");
    } catch (error) {
      toast.error("Došlo je do greške prilikom čuvanja porudžbine!");
      console.error("Error saving order:", error);
    }
  };

  const handleProdajaPotvrda = () => {
    if (prodatiArtikli.length === 0) {
      toast.error("Izaberite bar jedan artikal!");
      return;
    }

    const validSales = prodatiArtikli.filter((artikal) => artikal.kolicina > 0);

    if (validSales.length === 0) {
      toast.error("Nema artikala za prodaju!");
      return;
    }

    setShowProdajaPopup(false);
    setShowAdditionalInfoPopup(true);
  };

  const handleAdditionalInfoSubmit = async (skip: boolean = false) => {
    let kupacInfo: any = {
      pol: pol,
      grad: grad,
      starosnaGrupa: starosnaGrupa,
    };
    let salesData = {
      sale: prodatiArtikli,
    };

    let salesDataToSend = {
      kupacInfo: kupacInfo,
      salesData: prodatiArtikli,
    };

    if (!skip) {
      if (pol) kupacInfo.pol = pol;
      if (grad) kupacInfo.grad = grad;
      if (starosnaGrupa) kupacInfo.starosnaGrupa = starosnaGrupa;
    }

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(salesDataToSend),
      });

      if (!response.ok) {
        throw new Error("Failed to save sales data");
      }

      const result = await response.json();
      toast.success("Prodaja je uspešno sačuvana!");
      setProdatiArtikli([]);
      setPol("");
      setGrad("");
      setStarosnaGrupa("");
      setShowAdditionalInfoPopup(false);
    } catch (error) {
      toast.error("Došlo je do greške prilikom čuvanja prodaje!");
      console.error("Error saving sales:", error);
    }
  };

  const handleArtikalChange = (id: number, value: string, prodId: number) => {
    const kolicina = value === "" ? 0 : parseInt(value);
    setProdatiArtikli((prev) => {
      const existingIndex = prev.findIndex((a) => a.id === id);

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].kolicina = kolicina;
        return updated;
      } else {
        return [...prev, { id, kolicina, prodId }];
      }
    });
  };

  const handleKeyPress = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    action: () => void
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8"
      >
        <h1 className="text-4xl font-bold text-green-600 mb-6 text-center">
          Dobrodošli!
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Upravljajte finansijama vašeg biznisa sa lakoćom.
        </p>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="trosak"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Novi Trošak (RSD)
            </label>
            <input
              type="number"
              id="trosak"
              value={trosak}
              onChange={(e) => setTrosak(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleTrosakSubmit)}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Unesite iznos"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTrosakSubmit}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition duration-300 font-semibold"
          >
            Dodaj Trošak
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleProdajaSubmit}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition duration-300 font-semibold"
          >
            Dodaj Prodaju
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOrderSubmit}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition duration-300 font-semibold"
          >
            Dodaj Porudžbinu
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showTrosakPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div className="bg-white p-8 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                Izaberite Kategoriju Troška
              </h2>
              {expenseCategories.map((category) => (
                <div
                  key={category.id}
                  className="mb-4 cursor-pointer"
                  onClick={() => handleTrosakPotvrda(category.id)}
                >
                  <div className="p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition duration-300">
                    {category.name}
                  </div>
                </div>
              ))}
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setShowTrosakPopup(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Otkaži
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {showProdajaPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div className="bg-white p-8 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Prodati Artikli</h2>
              {menuSections.map((category) => (
                <div key={category.id} className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {category.name}
                  </h3>
                  {category.products.map((section) => (
                    <div
                      key={section.id}
                      className="flex justify-between items-center mb-2"
                    >
                      <span className="text-gray-700">
                        {section.name} - {section.price} RSD
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={
                          prodatiArtikli.find((a) => a.id === section.id)
                            ?.kolicina || ""
                        }
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          handleArtikalChange(section.id, value, section.id);
                        }}
                        onKeyPress={(e) =>
                          handleKeyPress(e, handleProdajaPotvrda)
                        }
                        className="w-20 px-2 py-1 border rounded text-right"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              ))}
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setShowProdajaPopup(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Otkaži
                </button>
                <button
                  onClick={handleProdajaPotvrda}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Potvrdi Prodaju
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {showOrderPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div className="bg-white p-8 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Nova Porudžbina</h2>
              {menuSections.map((category) => (
                <div key={category.id} className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {category.name}
                  </h3>
                  {category.products.map((section) => (
                    <div
                      key={section.id}
                      className="flex justify-between items-center mb-2"
                    >
                      <span className="text-gray-700">
                        {section.name} - {section.price} RSD
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={
                          prodatiArtikli.find((a) => a.id === section.id)
                            ?.kolicina || ""
                        }
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          handleArtikalChange(section.id, value, section.id);
                        }}
                        className="w-20 px-2 py-1 border rounded text-right"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              ))}
              <div className="space-y-4 mt-4">
                <textarea
                  value={orderDescription}
                  onChange={(e) => setOrderDescription(e.target.value)}
                  placeholder="Opis porudžbine"
                  className="w-full px-4 py-2 rounded-md border border-gray-300"
                  rows={3}
                />
                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300"
                />
                <input
                  type="time"
                  value={orderTime}
                  onChange={(e) => setOrderTime(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300"
                />
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setShowOrderPopup(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Otkaži
                </button>
                <button
                  onClick={handleOrderPotvrda}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Potvrdi Porudžbinu
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {showAdditionalInfoPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div className="bg-white p-8 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Dodatne Informacije</h2>
              <div className="mb-4">
                <label
                  htmlFor="pol"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Pol
                </label>
                <select
                  id="pol"
                  value={pol}
                  onChange={(e) => setPol(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Izaberite pol</option>
                  <option value="muški">Muški</option>
                  <option value="ženski">Ženski</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="grad"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Grad
                </label>
                <input
                  type="text"
                  id="grad"
                  value={grad}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[0-9]/g, "");
                    setGrad(value);
                  }}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Unesite grad"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="starosnaGrupa"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Starosna Grupa
                </label>
                <select
                  id="starosnaGrupa"
                  value={starosnaGrupa}
                  onChange={(e) => setStarosnaGrupa(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Izaberite starosnu grupu</option>
                  {starosneGrupe.map((grupa) => (
                    <option key={grupa} value={grupa}>
                      {grupa}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleAdditionalInfoSubmit(true)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Preskoči
                </button>
                <button
                  onClick={() => handleAdditionalInfoSubmit(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Potvrdi
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
