"use client";
import React from "react";

const RegisterPage: React.FC = () => {
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
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Ime
              </label>
              <input
                type="text"
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
