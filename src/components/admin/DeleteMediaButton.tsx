"use client";

import { useTransition } from "react";
import { deleteMedia } from "@/app/actions/admin";

export default function DeleteMediaButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("¿Estás seguro de eliminar esta imagen del portafolio?")) {
      startTransition(async () => {
        await deleteMedia(id);
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
        background: 'rgba(220, 53, 69, 0.9)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        cursor: 'pointer',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      }}
      title="Eliminar"
    >
      {isPending ? "..." : "X"}
    </button>
  );
}
