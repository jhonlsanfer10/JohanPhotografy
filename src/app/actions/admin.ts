"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return session;
}

// -- Content Actions --
export async function updateContent(key: string, value: string) {
  await requireAuth();
  await prisma.content.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  revalidatePath("/");
}

// -- Media/Gallery Actions --
export async function addMedia(data: { title: string; url: string; type: string; category: string }) {
  await requireAuth();
  await prisma.media.create({ data });
  revalidatePath("/");
}

export async function deleteMedia(id: string) {
  await requireAuth();
  await prisma.media.delete({ where: { id } });
  revalidatePath("/");
}

// -- Services Actions --
export async function addService(data: { title: string; description: string; price?: string; icon?: string }) {
  await requireAuth();
  await prisma.service.create({ data });
  revalidatePath("/");
}

export async function updateService(id: string, data: Partial<{ title: string; description: string; price: string; icon: string }>) {
  await requireAuth();
  await prisma.service.update({ where: { id }, data });
  revalidatePath("/");
}

export async function deleteService(id: string) {
  await requireAuth();
  await prisma.service.delete({ where: { id } });
  revalidatePath("/");
}
