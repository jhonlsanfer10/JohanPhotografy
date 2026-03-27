import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import MessageActions from "./MessageActions";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/admin/login");
  }

  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ padding: "4rem 2rem", maxWidth: "1000px", margin: "0 auto", minHeight: "100vh" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "50%", background: "var(--background)", border: "1px solid var(--border)", color: "var(--text-main)", transition: "all 0.2s" }} className="hover:bg-accent hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-syne)", fontWeight: 700 }}>Bandeja de Entrada</h1>
        </div>
        <div style={{ background: "var(--accent-color)", color: "white", padding: "0.5rem 1rem", borderRadius: "20px", fontSize: "0.9rem", fontWeight: 600 }}>
          {messages.length} Mensajes
        </div>
      </header>

      {messages.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem 0", color: "var(--text-muted)", border: "1px dashed var(--border)", borderRadius: "12px" }}>
          <p style={{ fontSize: "1.2rem", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>No tienes mensajes nuevos.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ 
              background: msg.read ? "var(--background)" : "var(--surface)", 
              border: `1px solid ${msg.read ? "var(--border)" : "var(--accent-color)"}`,
              padding: "1.5rem", 
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              transition: "all 0.3s ease",
              opacity: msg.read ? 0.8 : 1
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {msg.name}
                    {!msg.read && <span style={{ display: "inline-block", width: "8px", height: "8px", background: "var(--accent-color)", borderRadius: "50%" }}></span>}
                  </h3>
                  <a href={`mailto:${msg.email}`} style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{msg.email}</a>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {new Date(msg.createdAt).toLocaleDateString("es-ES", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <MessageActions id={msg.id} isRead={msg.read} />
                </div>
              </div>
              
              <div style={{ background: "var(--background-alt)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border)", color: "var(--text-main)", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
