"use client";
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

export default function EditPage() {
  const [companyName, setCompanyName] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
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
  const [newExpenseCategoryName, setNewExpenseCategoryName] = useState("");
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
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName }),
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

  const handleCreateExpenseCategory = async () => {
    if (!newExpenseCategoryName) {
      toast.error("Unesite naziv kategorije troška!");
      return;
    }

    try {
      const response = await fetch("/api/expense-categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newExpenseCategoryName }),
      });

      if (!response.ok) {
        throw new Error(
          "Došlo je do greške prilikom kreiranja kategorije troška!"
        );
      }

      const newExpenseCategory = await response.json();
      setNewExpenseCategoryName("");
      toast.success("Kategorija troška je uspešno kreirana!");
    } catch (error) {
      toast.error("Došlo je do greške prilikom kreiranja kategorije troška!");
      console.error("Error creating expense category:", error);
    }
  };

  const handleCreateProduct = async () => {
    if (!newProductName || !newProductPrice || selectedCategoryId === null) {
      toast.error("Unesite sve podatke o proizvodu!");
      return;
    }

    if (Number(newProductPrice) < 0) {
      toast.error("Cena proizvoda ne može biti negativna!");
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newProductName,
          price: Number(newProductPrice),
          categoryId: selectedCategoryId,
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
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="bg-green-600 p-4 sm:p-6 text-white text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Zdravo "Vlasnik" Dobrodošli u
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold mt-1">
            {companyName} finansije
          </h2>
        </div>
        <div className="p-4 sm:p-6 ">
          <div className="bg-gray-100 p-4 rounded-lg shadow-md ">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Uredi profil
            </h3>

            <div className="mb-4 ">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ime biznisa
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCompanyName(e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="Ime biznisa"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ime vlasnika biznisa
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setOwnerName(e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="Ime vlasnika"
              />
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4">
                Nova Kategorija Proizvoda
              </h4>
              <div className="flex space-x-4 items-center">
                <input
                  type="text"
                  id="newCategory"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleCreateCategory)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Naziv kategorije"
                />
                <button
                  onClick={handleCreateCategory}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 font-semibold"
                >
                  Dodaj
                </button>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4">
                Nova Kategorija Troška
              </h4>
              <div className="flex space-x-4 items-center">
                <input
                  type="text"
                  id="newExpenseCategory"
                  value={newExpenseCategoryName}
                  onChange={(e) => setNewExpenseCategoryName(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Naziv kategorije"
                />
                <button
                  onClick={handleCreateExpenseCategory}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 font-semibold"
                >
                  Dodaj
                </button>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4">Novi Proizvod</h4>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <input
                    type="text"
                    id="newProduct"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                    placeholder="Naziv proizvoda"
                  />
                </div>
                <div className="w-1/2">
                  <input
                    type="number"
                    id="newProductPrice"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                    placeholder="Cena"
                    min="0"
                  />
                </div>
              </div>
              <select
                id="categorySelect"
                value={selectedCategoryId || ""}
                onChange={(e) =>
                  setSelectedCategoryId(Number(e.target.value) || null)
                }
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Izaberite kategoriju</option>
                {menuSections.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleCreateProduct}
                className="w-full mt-4 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition duration-300 font-semibold"
              >
                Dodaj Proizvod
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
