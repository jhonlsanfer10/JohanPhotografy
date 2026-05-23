import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendMessage, markMessageAsRead, deleteMessage } from "./contact";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    message: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("next-auth", () => {
  const mockNextAuth = vi.fn(() => ({}));
  return {
    default: mockNextAuth,
    getServerSession: vi.fn(),
  };
});

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Contact Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("sendMessage", () => {
    it("should successfully send a message and call prisma.create", async () => {
      const mockData = {
        name: "Test User",
        email: "test@example.com",
        message: "Hello world!",
      };

      vi.mocked(prisma.message.create).mockResolvedValue({
        id: "msg-123",
        ...mockData,
        read: false,
        createdAt: new Date(),
      });

      const result = await sendMessage(mockData);

      expect(prisma.message.create).toHaveBeenCalledWith({
        data: {
          name: mockData.name,
          email: mockData.email,
          message: mockData.message,
        },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/admin/messages");
      expect(result).toEqual({ success: true });
    });

    it("should fail and return an error if a field is missing", async () => {
      const mockData = {
        name: "",
        email: "test@example.com",
        message: "Hello world!",
      };

      const result = await sendMessage(mockData);

      expect(prisma.message.create).not.toHaveBeenCalled();
      expect(result).toEqual({ error: "Todos los campos son obligatorios." });
    });

    it("should handle prisma throw and return error message", async () => {
      const mockData = {
        name: "Test User",
        email: "test@example.com",
        message: "Hello",
      };

      vi.mocked(prisma.message.create).mockRejectedValue(new Error("DB Error"));

      const result = await sendMessage(mockData);

      expect(result).toEqual({ error: "DB Error" });
    });
  });

  describe("markMessageAsRead", () => {
    it("should mark message as read if authorized", async () => {
      vi.mocked(getServerSession).mockResolvedValue({ user: { name: "Admin" } });

      await markMessageAsRead("msg-123");

      expect(prisma.message.update).toHaveBeenCalledWith({
        where: { id: "msg-123" },
        data: { read: true },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/admin/messages");
    });

    it("should throw Unauthorized if not logged in", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      await expect(markMessageAsRead("msg-123")).rejects.toThrow("Unauthorized");
      expect(prisma.message.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteMessage", () => {
    it("should delete message if authorized", async () => {
      vi.mocked(getServerSession).mockResolvedValue({ user: { name: "Admin" } });

      await deleteMessage("msg-123");

      expect(prisma.message.delete).toHaveBeenCalledWith({
        where: { id: "msg-123" },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/admin/messages");
    });

    it("should throw Unauthorized if not logged in", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      await expect(deleteMessage("msg-123")).rejects.toThrow("Unauthorized");
      expect(prisma.message.delete).not.toHaveBeenCalled();
    });
  });
});
