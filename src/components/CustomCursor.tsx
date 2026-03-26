"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import styles from "./CustomCursor.module.css";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [hasPointer, setHasPointer] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const pathname = usePathname();

  useEffect(() => {
    // Only enable if device has a fine pointer (mouse)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setHasPointer(mediaQuery.matches);

    if (!mediaQuery.matches) return;

    // Hide default cursor
    document.body.style.cursor = "none";
    const addNoCursor = (el: HTMLElement) => { el.style.cursor = "none"; };
    
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.classList.contains("clickable")
      ) {
        setIsHovered(true);
        addNoCursor(target);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [pathname]);

  if (!hasPointer) return null;

  return (
    <>
      <motion.div
        className={`${styles.cursor} ${isHovered ? styles.cursorHover : ""}`}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      />
      <motion.div
        className={styles.cursorDot}
        style={{
          x: useSpring(cursorX, { damping: 40, stiffness: 400, mass: 0.1 }),
          y: useSpring(cursorY, { damping: 40, stiffness: 400, mass: 0.1 }),
        }}
      />
    </>
  );
}
