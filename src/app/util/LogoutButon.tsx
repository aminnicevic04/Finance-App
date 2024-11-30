"use client";

import { signIn, signOut } from "next-auth/react";

export const LogoutButton = () => {
  return (
    <button onClick={() => signOut({ callbackUrl: "/login" })}>Log Out</button>
  );
};
