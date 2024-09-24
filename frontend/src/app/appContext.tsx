"use client";

import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<boolean>(false);

export default function AppContext({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        localStorage.getItem("token") ? setIsLoggedIn(true) : setIsLoggedIn(false);
    }, []);

    return (
        <AuthContext.Provider value={isLoggedIn}>
            {children}
        </AuthContext.Provider>
    );
}