"use client";
import "@/styles/globals.css";
import Sidebar from "./components/Sidebar/page";
import { Providers } from "./providers";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <Providers>{children}</Providers>
          </main>
        </div>
      </body>
    </html>
  );
}
