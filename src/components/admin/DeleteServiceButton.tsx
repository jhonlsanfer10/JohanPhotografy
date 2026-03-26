"use client";

import { useTransition } from "react";
import { deleteService } from "@/app/actions/admin";

export default function DeleteServiceButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("¿Eliminar este servicio?")) {
      startTransition(async () => {
        await deleteService(id);
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        zIndex: 10,
        background: 'var(--bg-color)',
        color: 'var(--text-main)',
        border: '1px solid var(--text-main)',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        cursor: 'pointer',
      }}
      title="Eliminar Servicio"
    >
      {isPending ? "..." : "X"}
    </button>
  );
}
