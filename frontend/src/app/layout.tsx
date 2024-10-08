import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./UI/Navbar";
import Footer from "./UI/Footer";
import AppContext, { AuthContext } from "./appContext";
import { useContext } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moneyball",
  description: "Baseball statistics website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <AppContext>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AppContext>
      </body>
    </html>
  );
}
