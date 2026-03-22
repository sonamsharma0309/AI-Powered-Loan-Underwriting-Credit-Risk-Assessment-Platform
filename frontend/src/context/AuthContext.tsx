import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

interface UserType {
  name: string;
  email: string;
  role?: "admin" | "user";
}

interface AuthContextType {
  token: string | null;
  user: UserType | null;
  setToken: (token: string | null) => void;
  setUser: (user: UserType | null) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<UserType | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  /* 🔥 ADMIN EMAIL LIST (ADD MORE IF NEEDED) */
  const ADMIN_EMAILS = ["admin@gmail.com"];

  /* LOAD SAVED STATE */

  useEffect(() => {

    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setTokenState(savedToken);
    }

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUserState(JSON.parse(savedUser));
    }

    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;

    if (savedTheme) {
      setTheme(savedTheme);
    } else {

      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      setTheme(prefersDark ? "dark" : "light");
    }

  }, []);

  /* APPLY THEME */

  useEffect(() => {

    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);

  }, [theme]);

  /* TOKEN HANDLING */

  const setToken = (newToken: string | null) => {

    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }

    setTokenState(newToken);
  };

  /* USER HANDLING (🔥 RBAC IMPROVED) */

  const setUser = (newUser: UserType | null) => {

    if (newUser) {

      const email = newUser.email?.toLowerCase();

      // 🔥 ROLE CHECK
      const role: "admin" | "user" =
        ADMIN_EMAILS.includes(email) ? "admin" : "user";

      const updatedUser = { ...newUser, role };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUserState(updatedUser);

    } else {

      localStorage.removeItem("user");
      setUserState(null);

    }
  };

  /* THEME TOGGLE */

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <AuthContext.Provider value={{ token, user, setToken, setUser, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

/* SAFE CONTEXT HOOK */

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};