"use client";

import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div style={{ width: 40, height: 40 }}></div>;

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      style={{
        background: "transparent",
        border: "none",
        color: "var(--text-main)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.5rem",
        transform: "scale(1)",
        transition: "transform var(--transition-fast)",
      }}
      className="theme-toggle-btn"
      title="Cambiar Modo"
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div style={{ position: "relative", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Sun
          size={22}
          strokeWidth={1.5}
          style={{
            position: "absolute",
            transition: "all 0.6s cubic-bezier(0.19, 1, 0.22, 1)",
            transform: isDark ? "rotate(-90deg) scale(0)" : "rotate(0) scale(1)",
            opacity: isDark ? 0 : 1,
            color: "var(--text-main)",
          }}
        />
        <Moon
          size={22}
          strokeWidth={1.5}
          style={{
            position: "absolute",
            transition: "all 0.6s cubic-bezier(0.19, 1, 0.22, 1)",
            transform: isDark ? "rotate(0) scale(1)" : "rotate(90deg) scale(0)",
            opacity: isDark ? 1 : 0,
            color: "var(--text-main)",
          }}
        />
      </div>
    </button>
  );
}
