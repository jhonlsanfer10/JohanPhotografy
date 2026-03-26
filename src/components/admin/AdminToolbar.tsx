"use client";

import { signOut } from "next-auth/react";
import styles from "./AdminToolbar.module.css";

export default function AdminToolbar() {
  return (
    <div className={styles.toolbar}>
      <div className={styles.brand}>Modo Edición <span>(Admin)</span></div>
      <div className={styles.actions}>
        <button onClick={() => signOut({ callbackUrl: '/' })} className={styles.buttonOutline}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
