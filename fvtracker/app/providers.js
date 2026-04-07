"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Provider as ReduxProvider } from "react-redux";
import store from "@/store";
import UserProviders from "@/lib/providers/user";
import CustomProviders, { LoadingProvider } from "@/lib/providers/custom";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UserProviders>
            <CustomProviders>{children}</CustomProviders>
          </UserProviders>
        </ThemeProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
