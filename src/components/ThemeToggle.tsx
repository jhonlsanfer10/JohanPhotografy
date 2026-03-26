"use client";

import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div style={{ width: 30, height: 30 }}></div>;

  return (
    <button
      onClick={() => setTheme(theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "light" : "dark")}
      style={{
        background: "transparent", border: "none", color: "var(--text-main)", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5rem", fontSize: "1.3rem"
      }}
      title="Cambiar Modo"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
