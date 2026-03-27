"use client";

import { useTransition } from "react";
import { Check, Trash2, Loader2 } from "lucide-react";
import { markMessageAsRead, deleteMessage } from "@/app/actions/contact";

export default function MessageActions({ id, isRead }: { id: string; isRead: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleMarkRead = () => {
    startTransition(async () => {
      await markMessageAsRead(id);
    });
  };

  const handleDelete = () => {
    if (confirm("¿Estás seguro de eliminar este mensaje permanentemente?")) {
      startTransition(async () => {
        await deleteMessage(id);
      });
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      {!isRead && (
        <button 
          onClick={handleMarkRead} 
          disabled={isPending}
          title="Marcar como leído"
          style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid var(--border)", background: "transparent", color: "var(--text-main)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: isPending ? 0.5 : 1 }}
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
        </button>
      )}
      <button 
        onClick={handleDelete} 
        disabled={isPending}
        title="Eliminar mensaje"
        style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #ff4b4b50", background: "transparent", color: "#ff4b4b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: isPending ? 0.5 : 1 }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
