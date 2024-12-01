"use client";

import React, { useState } from "react";
import Main from "./main/page";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
// import Sidebar from "./components/Sidebar/page";

export default function Home() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/");
    },
  });
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <>
      <main
        className={`flex-1 transition-all duration-500 ease-in-out `}
        onClick={() => setIsSidebarExpanded(false)}
      >
        <Main />
      </main>
    </>
  );
}
