import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "./page.module.css";

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);

import AdminToolbar from "@/components/admin/AdminToolbar";
import EditableText from "@/components/admin/EditableText";
import AddMediaModal from "@/components/admin/AddMediaModal";
import DeleteMediaButton from "@/components/admin/DeleteMediaButton";
import AddServiceModal from "@/components/admin/AddServiceModal";
import DeleteServiceButton from "@/components/admin/DeleteServiceButton";
import SiteNav from "@/components/SiteNav";

export default async function Home({ searchParams }: { searchParams: { lang?: string } }) {
  const session = await getServerSession(authOptions);
  const isAdmin = !!session;
  const lang = searchParams?.lang === 'en' ? 'en' : 'es';

  const [media, services, content] = await Promise.all([
    prisma.media.findMany({ orderBy: { createdAt: 'desc' }, take: isAdmin ? undefined : 6 }),
    prisma.service.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.content.findMany()
  ]);

  const getContent = (key: string, fallback: string) => {
    return content.find(c => c.key === `${key}_${lang}`)?.value ||
           content.find(c => c.key === key)?.value || fallback;
  };

  return (
    <main className={styles.main}>
      {isAdmin && <AdminToolbar />}

      <SiteNav />

      <header className={styles.hero}>
        <div className={`${styles.heroImageContainer} animate-clip`}>
          <img 
            src={getContent("hero_image", "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000&auto=format&fit=crop")}
            alt="Hero Background" 
            className={styles.heroImage} 
          />
        </div>
        
        <div className={styles.heroContent}>
          <h1 className={`${styles.heroTitle} animate-clip`}>
            <span>
              <EditableText contentKey={`hero_title_1_${lang}`} initialValue={getContent("hero_title_1", "Capturing")} initialColor={getContent(`hero_title_1_${lang}_color`, "inherit")} isAdmin={isAdmin} />
            </span>
            <span className="font-serif" style={{ textTransform: 'lowercase', fontStyle: 'italic', marginLeft: '12%', display: 'block', color: 'var(--accent-color)' }}>
              <EditableText contentKey={`hero_title_2_${lang}`} initialValue={getContent("hero_title_2", "timeless")} initialColor={getContent(`hero_title_2_${lang}_color`, "inherit")} isAdmin={isAdmin} />
            </span>
            <span>
              <EditableText contentKey={`hero_title_3_${lang}`} initialValue={getContent("hero_title_3", "Moments")} initialColor={getContent(`hero_title_3_${lang}_color`, "inherit")} isAdmin={isAdmin} />
            </span>
          </h1>
          <p className={`${styles.heroSubtitle} animate-fade-in`} style={{ animationDelay: '0.4s' }}>
            <EditableText 
              contentKey={`hero_subtitle_${lang}`} 
              initialValue={getContent("hero_subtitle", "Transformamos instantes efímeros en obras de arte eternas. Fotografía de autor para almas rebeldes y elegantes.")} 
              initialColor={getContent(`hero_subtitle_${lang}_color`, "inherit")}
              isAdmin={isAdmin} 
            />
          </p>
          <a href="#contact" className={`${styles.ctaButton} animate-fade-in`} style={{ animationDelay: '0.6s' }}>
            <EditableText contentKey={`hero_cta_${lang}`} initialValue={getContent("hero_cta", "Descubre Más")} isAdmin={isAdmin} />
          </a>
        </div>
      </header>

      <section id="portfolio" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {lang === 'en' ? 'Selected' : 'Obras'} <span className="font-serif text-accent" style={{ textTransform: 'lowercase', fontStyle: 'italic' }}>{lang === 'en' ? 'Works' : 'Destacadas'}</span>
          </h2>
          <p className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>
            <EditableText contentKey={`portfolio_desc_${lang}`} initialValue={getContent("portfolio_desc", "Una muestra de nuestra visión estética e historias cinematográficas.")} initialColor={getContent(`portfolio_desc_${lang}_color`, "inherit")} adaptive={true} isAdmin={isAdmin} />
          </p>
        </div>
        
        <div className={styles.galleryGrid}>
          {media.length > 0 ? (
            media.map((m) => (
              <div key={m.id} className={styles.galleryItem}>
                {isAdmin && <DeleteMediaButton id={m.id} />}
                {m.type === "IMAGE" || m.url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt={m.title} className={styles.galleryImage} />
                ) : (
                  <video src={m.url} className={styles.galleryImage} autoPlay muted loop />
                )}
                <div className={styles.galleryOverlay}>
                  <h3>{m.title}</h3>
                  <span className="font-serif" style={{fontStyle: 'italic'}}>{m.category}</span>
                </div>
              </div>
            ))
          ) : !isAdmin && (
            <div className={styles.galleryItem} style={{ gridColumn: 'span 12', height: '300px' }}>
              <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#ccc'}}>{lang === 'en' ? 'Empty' : 'Vacío'}</div>
            </div>
          )}
          
          {isAdmin && <AddMediaModal />}
        </div>
        
        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <Link href="/portfolio" className={styles.formSubmit} style={{ display: 'inline-block' }}>
            {lang === 'en' ? 'View Full Portfolio' : 'Ver Portafolio Completo'}
          </Link>
        </div>
      </section>

      <section id="services" className={`${styles.section} ${styles.altBackground}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{lang === 'en' ? 'Services' : 'Servicios'}</h2>
        </div>
        <div className={styles.servicesGrid}>
          {services.map(s => (
            <div key={s.id} className={styles.serviceCard} style={{position: 'relative'}}>
              {isAdmin && <DeleteServiceButton id={s.id} />}
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </div>
          ))}
          
          {services.length === 0 && !isAdmin && (
            <p style={{ gridColumn: 'span 3', textAlign: 'center' }}>{lang === 'en' ? 'Services coming soon...' : 'Servicios próximamente...'}</p>
          )}

          {isAdmin && <AddServiceModal />}
        </div>
      </section>
      
      <section id="contact" className={styles.section}>
         <div className={styles.contactWrapper}>
           <div className={styles.contactBox}>
             <h2 className={styles.contactTitle}>
               <EditableText contentKey={`contact_title_${lang}`} initialValue={getContent("contact_title", "Hagamos <br />magia juntos")} initialColor={getContent(`contact_title_${lang}_color`, "inherit")} adaptive={true} isAdmin={isAdmin} />
             </h2>
             <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '1.2rem', fontFamily: 'var(--font-playfair)' }}>
               <EditableText contentKey={`contact_desc_${lang}`} initialValue={getContent("contact_desc", "Déjanos un mensaje y nos pondremos en contacto contigo lo antes posible para crear algo inolvidable.")} initialColor={getContent(`contact_desc_${lang}_color`, "inherit")} adaptive={true} isAdmin={isAdmin} />
             </p>
             <div style={{ marginTop: '2rem' }}>
               <a href={`mailto:${getContent("contact_email", "hola@photografy.studio")}`} className={styles.contactEmail}>
                 <EditableText contentKey={`contact_email_${lang}`} initialValue={getContent("contact_email", "hola@photografy.studio")} initialColor={getContent(`contact_email_${lang}_color`, "inherit")} adaptive={true} isAdmin={isAdmin} />
               </a>
             </div>
           </div>

           <form className={styles.contactForm}>
             <div className={styles.inputGroup}>
               <label htmlFor="name">{lang === 'en' ? 'Your Name' : 'Tu Nombre'}</label>
               <input type="text" id="name" className={styles.contactInput} required />
             </div>
             <div className={styles.inputGroup}>
               <label htmlFor="email">{lang === 'en' ? 'Your Email' : 'Tu Correo'}</label>
               <input type="email" id="email" className={styles.contactInput} required />
             </div>
             <div className={styles.inputGroup}>
               <label htmlFor="message">{lang === 'en' ? 'Message' : 'Mensaje'}</label>
               <textarea id="message" className={styles.contactTextarea} required></textarea>
             </div>
             <button type="submit" className={styles.formSubmit}>
               {lang === 'en' ? 'Send Message' : 'Enviar Mensaje'}
             </button>
           </form>
         </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
             <h3>PHOTOGRAFY STUDIO</h3>
             <p><EditableText contentKey={`footer_text_${lang}`} initialValue={getContent("footer_text", "Capturando la esencia de momentos inolvidables.")} initialColor={getContent(`footer_text_${lang}_color`, "inherit")} isAdmin={isAdmin} /></p>
          </div>
          <div className={styles.footerLinks}>
            <h4>{lang === 'en' ? 'Explore' : 'Explorar'}</h4>
            <a href="#portfolio">{lang === 'en' ? 'Portfolio' : 'Portafolio'}</a>
            <a href="#services">{lang === 'en' ? 'Services' : 'Servicios'}</a>
            <a href="#contact">{lang === 'en' ? 'Contact' : 'Contacto'}</a>
          </div>
          <div className={styles.footerSocials}>
            <h4>{lang === 'en' ? 'Follow Us' : 'Síguenos'}</h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href={getContent("social_instagram_url", "#")} target="_blank" rel="noopener noreferrer"><InstagramIcon /></a>
              <a href={getContent("social_linkedin_url", "#")} target="_blank" rel="noopener noreferrer"><LinkedinIcon /></a>
              <a href={getContent("social_twitter_url", "#")} target="_blank" rel="noopener noreferrer"><TwitterIcon /></a>
            </div>
            {isAdmin && (
               <div style={{marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.75rem'}}>
                 <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}><InstagramIcon /> <EditableText contentKey="social_instagram_url" initialValue={getContent("social_instagram_url", "URL Instagram")} isAdmin={true} /></div>
                 <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}><LinkedinIcon /> <EditableText contentKey="social_linkedin_url" initialValue={getContent("social_linkedin_url", "URL LinkedIn")} isAdmin={true} /></div>
                 <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}><TwitterIcon /> <EditableText contentKey="social_twitter_url" initialValue={getContent("social_twitter_url", "URL Twitter")} isAdmin={true} /></div>
               </div>
            )}
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>
            <Link href="/admin/login" className={styles.hiddenAdminLink} title="©">
              ©
            </Link> {new Date().getFullYear()} Photografy Studio. {lang === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}
          </p>
          <div className={styles.footerLegal}>
            <a href="#">{lang === 'en' ? 'Privacy Policy' : 'Política de Privacidad'}</a>
            <a href="#">{lang === 'en' ? 'Terms of Service' : 'Términos y Condiciones'}</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
