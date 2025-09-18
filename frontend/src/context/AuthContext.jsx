import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      // jei "user" yra null, undefined arba tuščias stringas – grąžinam null
      if (!storedUser || storedUser === "undefined" || storedUser === "") {
        return null;
      }
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Klaida skaitant user iš localStorage:", error);
      // jei JSON.parse sugriuvo – išvalom blogą reikšmę
      localStorage.removeItem("user");
      return null;
    }
  });

  const login = (data) => {
    setToken(data.token);
    localStorage.setItem("token", data.token);

    setUser(data.user); // turi būti objektas {id, name, role, ...}
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
