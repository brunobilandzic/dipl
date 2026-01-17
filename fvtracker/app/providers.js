"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Provider as ReduxProvider } from "react-redux";
import store from "@/store";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
