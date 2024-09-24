"use client";

import { createContext, useEffect, useState } from "react";
import Navbar from "./UI/Navbar";
import { redirect, usePathname } from "next/navigation";

export const AuthContext = createContext<boolean>(false);
export const UserNameContext = createContext<string | null>(null);

export default function AppContext({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false);

            if (pathname !== '/login' && pathname !== '/signup' && pathname !== '/') {
                redirect('/');
            }
        }
    }, [pathname]);

    return (
        <AuthContext.Provider value={isLoggedIn}>
            {isLoggedIn && <Navbar />}
            {children}
        </AuthContext.Provider>
    );
}