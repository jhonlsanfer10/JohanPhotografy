"use client";

import { useState, useTransition } from "react";
import { sendMessage } from "@/app/actions/contact";
import styles from "@/app/page.module.css";
import FadeIn from "./animations/FadeIn";

export default function ContactForm({ lang }: { lang: 'en' | 'es' }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    startTransition(async () => {
      setStatus("idle");
      const res = await sendMessage(data);
      if (res?.error) {
        setStatus("error");
        setErrorMessage(res.error);
      } else {
        setStatus("success");
      }
    });
  };

  if (status === "success") {
    return (
      <FadeIn className={styles.contactForm} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>
          {lang === 'en' ? "Thank you!" : "¡Gracias!"}
        </h3>
        <p style={{ color: 'var(--text-muted)' }}>
          {lang === 'en' 
            ? "Your message has been sent successfully. We will contact you soon." 
            : "Tu mensaje ha sido enviado exitosamente. Nos pondremos en contacto contigo pronto."}
        </p>
        <button onClick={() => setStatus("idle")} className={styles.formSubmit} style={{ marginTop: '2rem', width: 'auto', padding: '0.8rem 2rem' }}>
          {lang === 'en' ? "Send another message" : "Enviar otro mensaje"}
        </button>
      </FadeIn>
    );
  }

  return (
    <form className={styles.contactForm} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label htmlFor="name">{lang === 'en' ? 'Your Name' : 'Tu Nombre'}</label>
        <input type="text" id="name" name="name" className={styles.contactInput} required disabled={isPending} />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="email">{lang === 'en' ? 'Your Email' : 'Tu Correo'}</label>
        <input type="email" id="email" name="email" className={styles.contactInput} required disabled={isPending} />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="message">{lang === 'en' ? 'Message' : 'Mensaje'}</label>
        <textarea id="message" name="message" className={styles.contactTextarea} required disabled={isPending}></textarea>
      </div>
      
      {status === "error" && (
        <p style={{ color: '#ff4b4b', fontSize: '0.9rem', marginBottom: '1rem' }}>{errorMessage}</p>
      )}

      <button type="submit" className={styles.formSubmit} disabled={isPending}>
        {isPending 
          ? (lang === 'en' ? 'Sending...' : 'Enviando...') 
          : (lang === 'en' ? 'Send Message' : 'Enviar Mensaje')
        }
      </button>
    </form>
  );
}
