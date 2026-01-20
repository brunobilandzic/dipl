"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Provider as ReduxProvider, useSelector } from "react-redux";
import store from "@/store";
import UserProviders from "@/lib/providers/user";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UserProviders>{children}</UserProviders>
        </ThemeProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
