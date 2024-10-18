"use client";

import React, { useState } from "react";
import Main from "./main/page";
import Sidebar from "./components/Sidebar/page";

export default function Home() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="flex bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 min-h-screen">
      <Sidebar />
      <main
        className={`flex-1 transition-all duration-500 ease-in-out ${
          isSidebarExpanded ? "ml-64" : "ml-20"
        }`}
        onClick={() => setIsSidebarExpanded(false)}
      >
        <Main />
      </main>
    </div>
  );
}
