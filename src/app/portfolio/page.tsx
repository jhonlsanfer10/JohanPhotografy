import { prisma } from "../../lib/prisma";
import PortfolioGallery from "../../components/PortfolioGallery";
import SiteNav from "../../components/SiteNav";
import styles from "./portfolio.module.css";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const metadata = {
  title: "Portfolio | Creative Photography",
  description: "Una colección curada de nuestras historias visuales.",
};

export const dynamic = "force-dynamic";

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<{ lang?: string }> | { lang?: string } }) {
  // Handle Next.js 15+ Async searchParams safely
  const resolvedParams = await Promise.resolve(searchParams);
  const lang = resolvedParams?.lang === "en" ? "en" : "es";

  const session = await getServerSession(authOptions);
  const isAdmin = !!session;

  const [media, content] = await Promise.all([
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.content.findMany()
  ]);

  const getContent = (key: string, fallback: string) => {
    return content.find(c => c.key === `${key}_${lang}`)?.value ||
           content.find(c => c.key === key)?.value || fallback;
  };

  const logoType = getContent("site_logo_type", "TEXT") as "TEXT" | "IMAGE";
  const logoText = getContent("site_logo_text", "JOHAN PHOTOGRAFY");
  const logoImage = getContent("site_logo_image_url", "");

  return (
    <main className={styles.portfolioMain}>
      <SiteNav 
        isAdmin={isAdmin}
        logoType={logoType}
        logoText={logoText}
        logoImage={logoImage}
      />

      <header className={styles.portfolioHeader}>
        <div className={styles.headerContent}>
          <h1 className={`${styles.title} animate-clip`}>
            {lang === 'en' ? 'The' : 'El'} <span className="font-serif text-accent" style={{ fontStyle: 'italic', textTransform: 'lowercase' }}>{lang === 'en' ? 'Archive' : 'Archivo'}</span>
          </h1>
          <p className={`${styles.subtitle} animate-fade-in`}>
            {lang === 'en' 
              ? 'A curated collection of visual poetry and cinematic moments.' 
              : 'Una colección curada de poesía visual y momentos cinematográficos.'}
          </p>
        </div>
      </header>

      <div className={styles.galleryContainer}>
        <PortfolioGallery media={media} lang={lang} />
      </div>

      <footer className={styles.minimalFooter}>
        <Link href="/">← {lang === 'en' ? 'Back Home' : 'Volver al Inicio'}</Link>
      </footer>
    </main>
  );
}
