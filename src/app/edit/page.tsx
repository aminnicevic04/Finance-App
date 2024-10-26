"use client";

import React, { useState, useEffect } from "react";
import { FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface MenuItem {
  id: number;
  name: string;
}

interface MenuSection {
  id: number;
  name: string;
  products: MenuItem[];
}

interface EditingItem {
  sectionIndex: number;
  itemIndex: number;
  value: string;
}

const EditPage: React.FC = () => {
  const [companyName, setCompanyName] = useState<string>("");
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingItem, setEditingItem] = useState<EditingItem>({
    sectionIndex: -1,
    itemIndex: -1,
    value: "",
  });

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

  const addMenuItem = async (
    sectionIndex: number,
    item: string,
    price: number
  ): Promise<void> => {
    const categoryId = menuSections[sectionIndex].id;
    console.log(categoryId);

    const userId = 1;

    try {
      const response = await fetch("/api/addProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryId, productName: item, price, userId }),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setMenuSections((prev) =>
          prev.map((section, idx) =>
            idx === sectionIndex
              ? { ...section, products: [...section.products, newProduct] }
              : section
          )
        );
      } else {
        console.error("Failed to add product:", response.status);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const removeMenuItem = async (
    sectionIndex: number,
    itemIndex: number
  ): Promise<void> => {
    const section = menuSections[sectionIndex];
    const productToDelete = section.products[itemIndex];

    try {
      const response = await fetch("/api/deleteProduct", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: productToDelete.id }),
      });

      if (response.ok) {
        setMenuSections((prev) =>
          prev.map((section, idx) =>
            idx === sectionIndex
              ? {
                  ...section,
                  products: section.products.filter((_, i) => i !== itemIndex),
                }
              : section
          )
        );
      } else {
        console.error("Failed to remove product:", response.status);
      }
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const startEditing = (
    sectionIndex: number,
    itemIndex: number,
    value: string
  ): void => {
    setEditingItem({ sectionIndex, itemIndex, value });
  };

  const finishEditing = async (): Promise<void> => {
    if (editingItem.sectionIndex !== -1 && editingItem.itemIndex !== -1) {
      const section = menuSections[editingItem.sectionIndex];

      const productToUpdate = section.products[editingItem.itemIndex];
      const productId = productToUpdate.id;
      const updatedProduct = {
        id: productId,
        name: editingItem.value,
      };

      try {
        const response = await fetch("/api/updateProduct", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        });

        if (response.ok) {
          const updatedProductData = await response.json();
          setMenuSections((prev) =>
            prev.map((section, sIdx) =>
              sIdx === editingItem.sectionIndex
                ? {
                    ...section,
                    products: section.products.map((item, iIdx) =>
                      iIdx === editingItem.itemIndex
                        ? updatedProductData // Replace with updated product data
                        : item
                    ),
                  }
                : section
            )
          );
        } else {
          console.error("Failed to update product:", response.status);
        }
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
    setEditingItem({ sectionIndex: -1, itemIndex: -1, value: "" });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Učitavanje...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2 text-gray-700">Meni</h4>
            {menuSections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="mb-4 bg-gray-50 p-3 rounded-lg"
              >
                <h5 className="text-md font-medium mb-2 text-blue-700">
                  {section.name}
                </h5>
                <ul className="mb-2 text-sm">
                  {section.products.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-center justify-between py-1"
                    >
                      {editingItem.sectionIndex === sectionIndex &&
                      editingItem.itemIndex === itemIndex ? (
                        <input
                          type="text"
                          value={editingItem.value}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEditingItem({
                              ...editingItem,
                              value: e.target.value,
                            })
                          }
                          className="flex-grow px-2 py-1 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      ) : (
                        <span className="text-gray-600">{item.name}</span>
                      )}
                      <div className="flex space-x-2">
                        {editingItem.sectionIndex === sectionIndex &&
                        editingItem.itemIndex === itemIndex ? (
                          <>
                            <button
                              onClick={finishEditing}
                              className="text-green-500 hover:text-green-600 p-2"
                            >
                              <FiCheck size={24} />
                            </button>
                            <button
                              onClick={() =>
                                setEditingItem({
                                  sectionIndex: -1,
                                  itemIndex: -1,
                                  value: "",
                                })
                              }
                              className="text-red-500 hover:text-red-600 p-2"
                            >
                              <FiX size={24} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                startEditing(sectionIndex, itemIndex, item.name)
                              }
                              className="text-blue-500 hover:text-blue-600 p-2"
                            >
                              <FiEdit2 size={20} />
                            </button>
                            <button
                              onClick={() =>
                                removeMenuItem(sectionIndex, itemIndex)
                              }
                              className="text-red-500 hover:text-red-600 p-2"
                            >
                              <FiTrash2 size={20} />
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row">
                  <input
                    type="text"
                    placeholder={`Dodaj ${section.name.toLowerCase()}`}
                    className="flex-grow px-3 py-2 border border-blue-300 rounded-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-2 sm:mb-0"
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter" && e.currentTarget.value) {
                        addMenuItem(
                          sectionIndex + 1,
                          e.currentTarget.value,
                          100
                        );
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md sm:rounded-l-none hover:bg-blue-600 transition duration-200 text-sm"
                    onClick={() => {
                      const input = document.querySelector(
                        `input[placeholder="Dodaj ${section.name.toLowerCase()}"]`
                      ) as HTMLInputElement;
                      if (input.value) {
                        addMenuItem(sectionIndex, input.value, 100);
                        input.value = "";
                      }
                    }}
                  >
                    Dodaj
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition duration-200 font-semibold text-sm">
            Sačuvaj promene
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
