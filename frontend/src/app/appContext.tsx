"use client";

import { createContext, useEffect, useState } from "react";
import Navbar from "./UI/Navbar";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";

export const AuthContext = createContext<boolean>(false);

export default function AppContext({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false);

            if (router.pathname !== '/login' && router.pathname !== '/signup') {
                redirect('/login');
            }
        }
    }, [router]);

    return (
        <AuthContext.Provider value={isLoggedIn}>
            {isLoggedIn && <Navbar />}
            {children}
        </AuthContext.Provider>
    );
}