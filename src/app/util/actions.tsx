"use server";

import { sendMail } from "./email";

export const sendEmailHandler = async (formData: {
  name: string;
  prezime: string;
  phone: string;
  email: string;
  description: string;
}) => {
  await sendMail({
    to: "monetizenp1@gmail.com",
    name: "",
    subject: `Contact Form Submission from ${formData.name}`,
    body: `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Prezime:</strong> ${formData.prezime}</p>
      <p><strong>Phone:</strong> ${formData.phone}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Description:</strong></p>
      <p>${formData.description}</p>
    `,
  });
};
