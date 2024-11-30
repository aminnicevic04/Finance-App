"use client";

import { SessionProvider } from "next-auth/react";
import { execOnce } from "next/dist/shared/lib/utils";

type Props = {
  children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};
