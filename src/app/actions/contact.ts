"use server";

import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function sendMessage(data: { name: string; email: string; message: string }) {
  try {
    if (!data.name || !data.email || !data.message) {
      throw new Error("Todos los campos son obligatorios.");
    }
    
    await prisma.message.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
      }
    });
    
    // Attempt to notify but don't fail if we can't
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: "Hubo un error al enviar el mensaje." };
  }
}

export async function markMessageAsRead(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.message.update({
    where: { id },
    data: { read: true }
  });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.message.delete({
    where: { id }
  });
  revalidatePath("/admin/messages");
}
