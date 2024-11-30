"use client";
import React, { useState } from "react";
import { sendEmailHandler } from "../util/actions";

const RegisterPage: React.FC = () => {
  // Definisanje stanja forme
  const [formData, setFormData] = useState({
    name: "",
    prezime: "",
    email: "",
    phone: "",
    description: "",
  });

  // Handler za promenu input polja
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handler za slanje forme
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Pozivanje funkcije za slanje e-maila sa podacima iz forme
    await sendEmailHandler(formData);

    // Resetovanje forme (opciono)
    setFormData({
      name: "",
      prezime: "",
      email: "",
      phone: "",
      description: "",
    });

    // Možete dodati obaveštenje korisniku da je e-mail poslat
    alert("E-mail je poslat!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">
          Registracija
        </h1>
        <p className="text-gray-700 mb-6 text-lg leading-relaxed text-center">
          Naša aplikacija za praćenje finansija omogućava vam da pratite zaradu
          i potrošnju vašeg preduzeća. Da biste se pridružili našoj aplikaciji,
          potrebno je da vas kontaktira naš tim. Molimo vas da popunite sledeću
          formu i naš tim će vas kontaktirati u najkraćem mogućem roku.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Ime
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Vaše ime"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Prezime
              </label>
              <input
                type="text"
                name="prezime"
                value={formData.prezime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Vaše prezime"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Vaš email"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Broj telefona
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Vaš broj telefona"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Poruka
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={4}
              placeholder="Vaša poruka"
              required
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 font-semibold"
            >
              Pošalji
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
