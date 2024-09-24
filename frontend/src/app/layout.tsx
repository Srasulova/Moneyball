import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./UI/Navbar";
import Footer from "./UI/Footer";
import { createContext, useContext, useEffect, useState } from "react";
import User from "./apiClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moneyball",
  description: "Baseball statistics website",
};

export const AuthContext = createContext<boolean>(false);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext.Provider value={isLoggedIn}>
          {isLoggedIn && <Navbar />}
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthContext.Provider>
      </body>
    </html>
  );
}
