"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./SiteNav.module.css";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SiteNav() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const lang = searchParams?.get("lang") === "en" ? "en" : "es";
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleLanguage = () => {
    const newLang = lang === "es" ? "en" : "es";
    router.push(`/?lang=${newLang}`);
  };

  const navItems = [
    { href: "/portfolio", label: lang === "en" ? "Portfolio" : "Portafolio" },
    { href: "/#services", label: lang === "en" ? "Services" : "Servicios" },
    { href: "/#contact", label: lang === "en" ? "Contact" : "Contacto" },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">JOHAN PHOTOGRAFY</Link>
      </div>

      <div className={styles.navActions}>
        {/* Desktop Links */}
        <div className={styles.navLinks}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className={styles.tools}>
          <button onClick={toggleLanguage} className={styles.langToggle}>
            {lang.toUpperCase()}
          </button>
          <ThemeToggle />
          
          {/* Mobile Hamburger Button */}
          <button 
            className={styles.hamburgerBtn} 
            onClick={() => setIsMobileOpen(true)}
            aria-label="Menu"
          >
            <Menu size={26} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className={styles.mobileMenuHeader}>
              <span className={styles.logo}>JOHAN PHOTOGRAFY</span>
              <button 
                className={styles.closeBtn} 
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={32} strokeWidth={1} />
              </button>
            </div>
            
            <div className={styles.mobileNavLinks}>
              {navItems.map((item, i) => (
                <motion.div 
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Link href={item.href} onClick={() => setIsMobileOpen(false)}>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
