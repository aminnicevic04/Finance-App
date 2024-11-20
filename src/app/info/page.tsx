import React from "react";

const InfoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Podrška
        </h1>
        <p className="text-gray-700 mb-4">
          Dobrodošli na stranicu za podršku. Ako imate bilo kakvih pitanja ili
          problema, slobodno nas kontaktirajte putem sledećih kanala:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Email: support@monetize.com</li>
          <li>Telefon: +381 11 123 4567</li>
          <li>Adresa: Ulica Hasketa Paučine 123, Novi Pazar, Srbija</li>
        </ul>
        <p className="text-gray-700 mb-4">
          Naš tim za podršku je dostupan od ponedeljka do petka, od 9:00 do
          17:00 časova.
        </p>
        <p className="text-gray-700">
          Hvala što koristite naše usluge. Trudimo se da vam pružimo najbolju
          moguću podršku.
        </p>
      </div>
    </div>
  );
};

export default InfoPage;
