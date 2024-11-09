import React, { useState, KeyboardEvent, ChangeEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

export default function Home() {
  const [trosak, setTrosak] = useState("");
  const [opisTroska, setOpisTroska] = useState("");
  const [showTrosakPopup, setShowTrosakPopup] = useState(false);
  const [showProdajaPopup, setShowProdajaPopup] = useState(false);
  const [prodatiArtikli, setProdatiArtikli] = useState<
    { id: number; kolicina: number; prodId: number }[]
  >([]);

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
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const handleTrosakSubmit = () => {
    if (Number(trosak) <= 0) {
      toast.error("Unesite validan iznos troška!");
      return;
    }
    setShowTrosakPopup(true);
  };

  const handleTrosakPotvrda = async () => {
    if (!opisTroska) {
      toast.error("Unesite opis troška!");
      return;
    }

    try {
      // Pripremite podatke za slanje
      const expenseData = {
        amount: Number(trosak),
        description: opisTroska,
      };

      // Pošaljite POST zahtev na backend
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

      // Prikazujemo uspešnu poruku
      toast.success("Trošak je uspešno sačuvan!");
      console.log("Saved expense data:", result);

      // Resetovanje polja nakon uspešnog unosa
      setTrosak("");
      setOpisTroska("");
      setShowTrosakPopup(false);
    } catch (error) {
      toast.error("Došlo je do greške prilikom čuvanja troška!");
      console.error("Error saving expense:", error);
    }
  };

  const handleProdajaSubmit = () => {
    setShowProdajaPopup(true);
  };

  const handleProdajaPotvrda = async () => {
    if (prodatiArtikli.length === 0) {
      toast.error("Izaberite bar jedan artikal!");
      return;
    }

    const validSales = prodatiArtikli.filter((artikal) => artikal.kolicina > 0);

    if (validSales.length === 0) {
      toast.error("Nema artikala za prodaju!");
      return;
    }

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validSales),
      });

      if (!response.ok) {
        throw new Error("Failed to save sales data");
      }

      const result = await response.json();
      toast.success("Prodaja je uspešno sačuvana!");
      console.log("Saved sales data:", result);
      setProdatiArtikli([]);
      setShowProdajaPopup(false);
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
        // Ako artikal već postoji, ažuriraj količinu
        const updated = [...prev];
        updated[existingIndex].kolicina = kolicina;
        return updated;
      } else {
        // Ako artikal ne postoji, dodaj novi
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8"
      >
        <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
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
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Unesite iznos i pritisnite Enter"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTrosakSubmit}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300 font-semibold"
          >
            Dodaj Trošak
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleProdajaSubmit}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition duration-300 font-semibold"
          >
            Dodaj Prodaju
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
            <div className="bg-white p-8 rounded-lg w-96">
              <h2 className="text-2xl font-bold mb-4">Opis Troška</h2>
              <textarea
                value={opisTroska}
                onChange={(e) => setOpisTroska(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleTrosakPotvrda)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                rows={4}
                placeholder="Unesite opis troška i pritisnite Enter"
              ></textarea>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setShowTrosakPopup(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Otkaži
                </button>
                <button
                  onClick={handleTrosakPotvrda}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Potvrdi
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
      </AnimatePresence>
    </div>
  );
}
