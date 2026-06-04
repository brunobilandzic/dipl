"use client";

import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import store from "@/store";
import CustomProviders, { LoadingProvider } from "@/lib/providers/custom";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <CustomProviders>{children}</CustomProviders>
      </ReduxProvider>
    </SessionProvider>
  );
}
