import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "lws:auth:user";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem(AUTH_STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalTab, setAuthModalTab] = useState("signin");

    const openAuthModal = (tab = "signin") => {
        setAuthModalTab(tab);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    const login = (email, password) => {
        const newUser = {
            id: `user-${Date.now()}`,
            email,
            name: email.split("@")[0] || "User",
            emailVerified: true,
            provider: "password",
            createdAt: new Date().toISOString(),
        };
        setUser(newUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
        closeAuthModal();
        return newUser;
    };

    const signup = (name, email, password) => {
        const newUser = {
            id: `user-${Date.now()}`,
            email,
            name: name || email.split("@")[0] || "User",
            emailVerified: false,
            provider: "password",
            createdAt: new Date().toISOString(),
        };
        setUser(newUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
        closeAuthModal();
        return newUser;
    };

    const loginWithGoogle = () => {
        const newUser = {
            id: `google-${Date.now()}`,
            email: "demo.user@loveccrafted.com",
            name: "Alex Morgan",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
            emailVerified: true,
            provider: "google",
            createdAt: new Date().toISOString(),
        };
        setUser(newUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
        closeAuthModal();
        return newUser;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
    };

    const resetPassword = (email) => {
        // Mock password reset email send
        return true;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                signup,
                loginWithGoogle,
                logout,
                resetPassword,
                isAuthModalOpen,
                authModalTab,
                openAuthModal,
                closeAuthModal,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
