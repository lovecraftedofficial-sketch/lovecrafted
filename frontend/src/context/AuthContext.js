import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("lovecrafted:user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [showGoogleChooser, setShowGoogleChooser] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("lovecrafted:user", JSON.stringify(user));
    } else {
      localStorage.removeItem("lovecrafted:user");
    }
  }, [user]);

  // Google Sign In handler
  const loginWithGoogle = (account) => {
    const avatarUrl =
      account.picture ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        account.name || "Google User"
      )}&background=d48b95&color=0a0507&bold=true&rounded=true`;

    const newUser = {
      name: account.name || "Google User",
      email: account.email || "user@gmail.com",
      picture: avatarUrl,
      provider: "google",
      id: account.id || `google_${Date.now()}`,
    };

    setUser(newUser);
    setShowGoogleChooser(false);
    toast.success(`Welcome, ${newUser.name.split(" ")[0]}! Signed in with Google 🎉`);
    return newUser;
  };

  // Standard Email Login / Register
  const loginWithEmail = (emailInput, nameInput) => {
    const defaultName = nameInput || emailInput.split("@")[0] || "Romantic Creator";
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      defaultName
    )}&background=4a0e1c&color=f5e6d3&bold=true&rounded=true`;

    const newUser = {
      name: defaultName,
      email: emailInput,
      picture: avatarUrl,
      provider: "email",
      id: `email_${Date.now()}`,
    };

    setUser(newUser);
    toast.success(`Welcome, ${defaultName}! Signed in successfully ❤️`);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("lovecrafted:user");
    toast.info("Signed out from LoveCrafted");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loginWithGoogle,
        loginWithEmail,
        logout,
        showGoogleChooser,
        setShowGoogleChooser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
