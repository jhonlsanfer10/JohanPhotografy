"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./SiteNav.module.css";

export default function SiteNav() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams?.get("lang") === "en" ? "en" : "es";

  const toggleLanguage = () => {
    const newLang = lang === "es" ? "en" : "es";
    router.push(`/?lang=${newLang}`);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">JOHAN PHOTOGRAFY</Link>
      </div>
      <div className={styles.navActions}>
        <div className={styles.navLinks}>
          <Link href="/portfolio">{lang === "en" ? "Portfolio" : "Portafolio"}</Link>
          <a href="/#services">{lang === "en" ? "Services" : "Servicios"}</a>
          <a href="/#contact">{lang === "en" ? "Contact" : "Contacto"}</a>
        </div>

        <div className={styles.tools}>
          <button onClick={toggleLanguage} className={styles.langToggle}>
            {lang.toUpperCase()}
          </button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
