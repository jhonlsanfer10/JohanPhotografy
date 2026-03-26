"use client";

import { useState, useTransition } from "react";
import { addService } from "@/app/actions/admin";
import styles from "./AdminModals.module.css";

export default function AddServiceModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await addService({ title, description });
      setIsOpen(false);
      setTitle("");
      setDescription("");
    });
  };

  if (!isOpen) {
    return (
      <div 
        style={{ border: '2px dashed rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '200px' }}
        onClick={() => setIsOpen(true)}
      >
        <span style={{ fontSize: '1.2rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)' }}>+ Añadir Servicio</span>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Nuevo Servicio</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input required placeholder="Título (Ej. Bodas)" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea required placeholder="Descripción técnica o artística..." value={description} onChange={e => setDescription(e.target.value)} rows={4} />
          
          <div className={styles.actions}>
            <button type="submit" disabled={isPending} className={styles.btnPrimary}>
              {isPending ? "Guardando..." : "Guardar"}
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
