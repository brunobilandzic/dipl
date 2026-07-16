import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Navbar } from "@/components/layout/navbar";
import { LoadingProvider } from "@/lib/providers/custom";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FV Tracker",
  description: "Aplikacija za praćenje poljoprivredne proizvodnje",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hr" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pb-6`}
      >
        <Providers>
          <Navbar />
          <div className="w-full max-w-6xl mx-auto px-4 py-10">
            <LoadingProvider>{children}</LoadingProvider>{" "}
          </div>
        </Providers>
      </body>
    </html>
  );
}
