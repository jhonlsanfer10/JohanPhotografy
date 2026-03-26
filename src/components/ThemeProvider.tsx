"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export const ThemeContext = createContext<{ theme: Theme; setTheme: (theme: Theme) => void }>({ 
  theme: "system", setTheme: () => null 
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ThemeProvider({ children, attribute = "data-theme", defaultTheme = "system" }: any) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute(attribute, isDark ? "dark" : "light");
    } else {
      document.documentElement.setAttribute(attribute, newTheme);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(saved);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(defaultTheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultTheme, attribute]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
