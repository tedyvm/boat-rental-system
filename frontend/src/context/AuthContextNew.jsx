import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser || storedUser === "undefined" || storedUser === "") {
        return null;
      }
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Klaida skaitant user iš localStorage:", error);
      localStorage.removeItem("user");
      return null;
    }
  });

  const login = (data) => {
    setToken(data.token);
    localStorage.setItem("token", data.token);

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    // NEBENAUDOJAME useNavigate ČIA
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Čia irgi paliekam tik state reset
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
