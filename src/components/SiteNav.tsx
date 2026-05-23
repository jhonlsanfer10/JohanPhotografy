"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./SiteNav.module.css";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateContent } from "@/app/actions/admin";
import modalStyles from "./admin/AdminModals.module.css";

interface SiteNavProps {
  isAdmin?: boolean;
  logoText?: string;
  logoImage?: string;
  logoType?: "TEXT" | "IMAGE";
}

export default function SiteNav({ 
  isAdmin = false, 
  logoText = "JOHAN PHOTOGRAFY", 
  logoImage = "", 
  logoType = "TEXT" 
}: SiteNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const lang = searchParams?.get("lang") === "en" ? "en" : "es";
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [logoTextVal, setLogoTextVal] = useState(logoText);
  const [logoImageVal, setLogoImageVal] = useState(logoImage);
  const [logoTypeVal, setLogoTypeVal] = useState(logoType);
  const [isSavingLogo, setIsSavingLogo] = useState(false);

  // Close menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const renderLogo = () => {
    if (logoType === "IMAGE" && logoImage) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoImage} alt={logoText || "Logo"} className={styles.logoImage} />
      );
    }
    return logoText || "JOHAN PHOTOGRAFY";
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">{renderLogo()}</Link>
        {isAdmin && (
          <button 
            onClick={() => setIsEditingLogo(true)} 
            style={{
              marginLeft: "0.8rem",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
              opacity: 0.7,
              transition: "opacity 0.2s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "0.7")}
            title="Configurar Logo"
          >
            ⚙️
          </button>
        )}
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
              <span className={styles.logo}>{renderLogo()}</span>
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

      {/* Elegant Admin Logo Modal */}
      {isEditingLogo && (
        <div className={modalStyles.modalOverlay} onClick={() => setIsEditingLogo(false)}>
          <div className={modalStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.8rem", fontFamily: "var(--font-playfair)" }}>Configurar Logo</h3>
            <div className={modalStyles.form}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "var(--font-syne)", textTransform: "uppercase" }}>Tipo de Logo</label>
                <select 
                  value={logoTypeVal} 
                  onChange={(e) => setLogoTypeVal(e.target.value as "TEXT" | "IMAGE")}
                  style={{
                    background: "var(--bg-color)",
                    color: "var(--text-main)",
                    border: "none",
                    borderBottom: "1px solid rgba(131, 123, 116, 0.3)",
                    padding: "0.5rem 0",
                    outline: "none"
                  }}
                >
                  <option value="TEXT">Texto</option>
                  <option value="IMAGE">Imagen</option>
                </select>
              </div>
              
              {logoTypeVal === "TEXT" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "var(--font-syne)", textTransform: "uppercase" }}>Texto del Logo</label>
                  <input 
                    type="text" 
                    value={logoTextVal} 
                    onChange={(e) => setLogoTextVal(e.target.value)} 
                    placeholder="JOHAN PHOTOGRAFY"
                  />
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "var(--font-syne)", textTransform: "uppercase" }}>URL de la Imagen</label>
                  <input 
                    type="text" 
                    value={logoImageVal} 
                    onChange={(e) => setLogoImageVal(e.target.value)} 
                    placeholder="https://images.unsplash.com/..."
                  />
                  {logoImageVal && (
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Vista Previa:</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logoImageVal} alt="Vista Previa" style={{ maxHeight: '50px', maxWidth: '100%', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', padding: '5px' }} />
                    </div>
                  )}
                </div>
              )}

              <div className={modalStyles.actions} style={{ marginTop: "1rem" }}>
                <button 
                  className={modalStyles.btnPrimary} 
                  disabled={isSavingLogo}
                  onClick={async () => {
                    setIsSavingLogo(true);
                    try {
                      await updateContent("site_logo_type", logoTypeVal);
                      if (logoTypeVal === "TEXT") {
                        await updateContent("site_logo_text", logoTextVal);
                      } else {
                        await updateContent("site_logo_image_url", logoImageVal);
                      }
                      router.refresh();
                      setIsEditingLogo(false);
                    } catch {
                      alert("Error al actualizar el logo.");
                    } finally {
                      setIsSavingLogo(false);
                    }
                  }}
                >
                  {isSavingLogo ? "Guardando..." : "Guardar"}
                </button>
                <button className={modalStyles.btnSecondary} onClick={() => setIsEditingLogo(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
