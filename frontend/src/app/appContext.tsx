"use client";

import { createContext, useEffect, useState } from "react";
import Navbar from "./UI/Navbar";

export const AuthContext = createContext<boolean>(false);

export default function AppContext({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        localStorage.getItem("token") ? setIsLoggedIn(true) : setIsLoggedIn(false);
    }, []);

    return (
        <AuthContext.Provider value={isLoggedIn}>
            {isLoggedIn && <Navbar />}
            {children}
        </AuthContext.Provider>
    );
}