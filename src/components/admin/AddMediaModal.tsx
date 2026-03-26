/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useTransition } from "react";
import { addMedia } from "@/app/actions/admin";
import styles from "./AdminModals.module.css";
import { UploadCloud } from "lucide-react";

export default function AddMediaModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Portraits");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "photografy_uploads");

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dxlmdzkje";
        
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.secure_url) {
          const mediaType = data.resource_type === "video" ? "VIDEO" : "IMAGE";
          await addMedia({ title, url: data.secure_url, type: mediaType, category });
          setIsOpen(false);
          reset();
        } else {
          alert("Error subiendo el archivo: " + (data.error?.message || "Desconocido"));
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Hubo un problema de conexión al subir el archivo.");
      }
    });
  };

  const reset = () => {
    setTitle("");
    setFile(null);
    setPreview(null);
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
      <div className={styles.modalContent} style={{ width: '100%', maxWidth: '600px' }}>
        <h3>Nueva Obra Local</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            
            {/* Left side: Upload area */}
            <div style={{ flex: '1', minWidth: '250px' }}>
              <label 
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  border: '2px dashed var(--text-muted)', borderRadius: '8px', padding: '2rem',
                  cursor: 'pointer', backgroundColor: preview ? 'transparent' : 'var(--bg-alt)',
                  position: 'relative', overflow: 'hidden', height: '250px'
                }}
              >
                {preview ? (
                  <img src={preview} alt="Preview" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <>
                    <UploadCloud size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                    <span style={{ fontFamily: 'var(--font-syne)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      Click para elegir foto
                    </span>
                  </>
                )}
                <input type="file" accept="image/*,video/*" onChange={handleFileChange} style={{ display: 'none' }} required />
              </label>
            </div>

            {/* Right side: Metadata */}
            <div style={{ flex: '1', minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <input required placeholder="Título de la obra" value={title} onChange={e => setTitle(e.target.value)} />
              
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option>Portraits</option>
                <option>Weddings</option>
                <option>Commercial</option>
                <option>Editorial</option>
                <option>Nature</option>
              </select>

              <div className={styles.actions} style={{ marginTop: 'auto' }}>
                <button type="submit" disabled={isPending || !file} className={styles.btnPrimary}>
                  {isPending ? "Subiendo..." : "Subir Foto"}
                </button>
                <button type="button" onClick={() => { setIsOpen(false); reset(); }} className={styles.btnSecondary} disabled={isPending}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
