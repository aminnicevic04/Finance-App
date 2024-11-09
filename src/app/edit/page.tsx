"use client";
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
//jebo mu githab seme

export default function Home() {
  const [companyName, setCompanyName] = useState<string>("");
  const [trosak, setTrosak] = useState("");
  const [opisTroska, setOpisTroska] = useState("");
  const [showTrosakPopup, setShowTrosakPopup] = useState(false);
  const [showProdajaPopup, setShowProdajaPopup] = useState(false);
  const [prodatiArtikli, setProdatiArtikli] = useState<
    { id: number; kolicina: number; prodId: number }[]
  >([]);
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

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

  const handleTrosakSubmit = () => {
    if (Number(trosak) <= 0) {
      toast.error("Unesite validan iznos troška!");
      return;
    }
    setShowTrosakPopup(true);
  };

  const changeName = async () => {
    console.log("radil");

    if (!companyName) {
      toast.error("Unesite ime");
    }

    try {
      const response = await fetch("/api/changeName", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: companyName,
          id: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save sales data");
      }
      toast.success("Ime je uspesno promenjeno");
    } catch (error) {
      toast.error("Došlo je do greške promene imena");
      console.error("Error changing name:", error);
    }

    return;
  };

  const handleTrosakPotvrda = async () => {
    if (!opisTroska) {
      toast.error("Unesite opis troška!");
      return;
    }

    try {
      const expenseData = {
        amount: Number(trosak),
        description: opisTroska,
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

  const handleCreateCategory = async () => {
    if (!newCategoryName) {
      toast.error("Unesite naziv kategorije!");
      return;
    }

    try {
      const response = await fetch("/api/addCategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryName: newCategoryName, userId: 1 }),
      });

      if (!response.ok) {
        throw new Error("Došlo je do greške prilikom kreiranja kategorije!");
      }

      const newCategory = await response.json();
      setMenuSections((prev) => [...prev, newCategory]);
      setNewCategoryName("");
      toast.success("Kategorija je uspešno kreirana!");
    } catch (error) {
      toast.error("Došlo je do greške prilikom kreiranja kategorije!");
      console.error("Error creating category:", error);
    }
  };

  const handleCreateProduct = async () => {
    if (!newProductName || !newProductPrice || selectedCategoryId === null) {
      toast.error("Unesite sve podatke o proizvodu!");
      return;
    }

    try {
      console.log(newProductName, Number(newProductPrice), selectedCategoryId);

      const response = await fetch("/api/addProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: newProductName,
          price: Number(newProductPrice),
          categoryId: selectedCategoryId,
          userId: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Došlo je do greške prilikom kreiranja proizvoda!");
      }

      const newProduct = await response.json();
      setMenuSections((prev) =>
        prev.map((section) =>
          section.id === selectedCategoryId
            ? { ...section, products: [...section.products, newProduct] }
            : section
        )
      );
      setNewProductName("");
      setNewProductPrice("");
      setSelectedCategoryId(null);
      toast.success("Proizvod je uspešno kreiran!");
    } catch (error) {
      toast.error("Došlo je do greške prilikom kreiranja proizvoda!");
      console.error("Error creating product:", error);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Učitavanje...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="bg-blue-600 p-4 sm:p-6 text-white text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold">Dobrodošli u</h1>
          <h2 className="text-xl sm:text-2xl font-bold mt-1">
            {companyName} finansije
          </h2>
        </div>
        <div className="p-4 sm:p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Uredi profil</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ime poslastičarnice
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCompanyName(e.target.value)
              }
              onKeyPress={(e) => handleKeyPress(e, changeName)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="newCategory"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nova Kategorija
              </label>
              <input
                type="text"
                id="newCategory"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleCreateCategory)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Unesite naziv kategorije i pritisnite Enter"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateCategory}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition duration-300 font-semibold"
            >
              Dodaj Kategoriju
            </motion.button>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="newProduct"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Novi Proizvod
              </label>
              <input
                type="text"
                id="newProductName"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                placeholder="Unesite naziv proizvoda"
              />
              <input
                type="number"
                id="newProductPrice"
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                placeholder="Unesite cenu proizvoda"
              />
              <select
                id="categorySelect"
                value={selectedCategoryId || ""}
                onChange={(e) =>
                  setSelectedCategoryId(Number(e.target.value) || null)
                }
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Izaberite kategoriju</option>
                {menuSections.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateProduct}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 transition duration-300 font-semibold"
            >
              Dodaj Proizvod
            </motion.button>
          </div>
        </div>
      </div>

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
                  Potvrdi Prodajuasdasdasdas
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
