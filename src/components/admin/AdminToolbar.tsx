"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import styles from "./AdminToolbar.module.css";
import { Mail } from "lucide-react";

export default function AdminToolbar() {
  return (
    <div className={styles.toolbar}>
      <div className={styles.brand}>Modo Edición <span>(Admin)</span></div>
      <div className={styles.actions} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link href="/admin/messages" className={styles.buttonOutline} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}>
          <Mail size={16} /> Mensajes
        </Link>
        <button onClick={() => signOut({ callbackUrl: '/' })} className={styles.buttonOutline}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
