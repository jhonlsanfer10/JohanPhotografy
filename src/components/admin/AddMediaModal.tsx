"use client";

import { useState, useTransition } from "react";
import { addMedia } from "@/app/actions/admin";
import styles from "./AdminModals.module.css";

export default function AddMediaModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("Portraits");
  const [type, setType] = useState("IMAGE");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await addMedia({ title, url, type, category });
      setIsOpen(false);
      setTitle("");
      setUrl("");
    });
  };

  if (!isOpen) {
    return (
      <button 
        className={styles.addGridItemBtn} 
        onClick={() => setIsOpen(true)}
      >
        <span>+</span> Añadir al Portafolio
      </button>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Nueva Obra</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input required placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
          <input required placeholder="URL de la imagen/video (unsplash, cloudinary...)" value={url} onChange={e => setUrl(e.target.value)} />
          <select value={category} onChange={e => setCategory(e.target.value)}>
             <option>Portraits</option>
             <option>Weddings</option>
             <option>Commercial</option>
             <option>Editorial</option>
          </select>
          <div className={styles.actions}>
            <button type="submit" disabled={isPending} className={styles.btnPrimary}>
              {isPending ? "Subiendo..." : "Añadir"}
            </button>
            <button type="button" onClick={() => setIsOpen(false)} className={styles.btnSecondary} disabled={isPending}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
