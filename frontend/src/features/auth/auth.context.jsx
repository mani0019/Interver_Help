import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api.js";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Accessible from anywhere
    const getAndSetUser = async () => {
        console.log("1. getMe starting...");
        try {
            const data = await getMe();
            console.log("2. getMe success:", data);
            setUser(data.user);
            return true;
        } catch (err) {
            console.log("3. getMe failed:", err.response?.status);
            setUser(null);
            return false;
        } finally {
            console.log("4. finally — setting loading false");
            setLoading(false);
        }
    };

    useEffect(() => {
        getAndSetUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                setLoading,
                getAndSetUser, // ✅ Export it
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};