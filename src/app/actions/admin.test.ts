import { describe, it, expect, vi, beforeEach } from "vitest";
import { 
  updateContent, 
  addMedia, 
  deleteMedia, 
  addService, 
  updateService, 
  deleteService 
} from "./admin";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    content: {
      upsert: vi.fn(),
    },
    media: {
      create: vi.fn(),
      delete: vi.fn(),
    },
    service: {
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

describe("Admin Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication checks (requireAuth)", () => {
    const actions = [
      () => updateContent("key", "value"),
      () => addMedia({ title: "M", url: "U", type: "IMAGE", category: "C" }),
      () => deleteMedia("id-123"),
      () => addService({ title: "S", description: "D" }),
      () => updateService("id-123", { title: "New S" }),
      () => deleteService("id-123"),
    ];

    it.each(actions)("should throw Unauthorized if no session is active", async (actionFn) => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      await expect(actionFn()).rejects.toThrow("Unauthorized");
    });
  });

  describe("Authorized Operations", () => {
    beforeEach(() => {
      vi.mocked(getServerSession).mockResolvedValue({ user: { name: "Admin" } });
    });

    describe("updateContent", () => {
      it("should upsert content and revalidate home path", async () => {
        await updateContent("hero_title", "New Hero");

        expect(prisma.content.upsert).toHaveBeenCalledWith({
          where: { key: "hero_title" },
          update: { value: "New Hero" },
          create: { key: "hero_title", value: "New Hero" },
        });
        expect(revalidatePath).toHaveBeenCalledWith("/");
      });
    });

    describe("Media Operations", () => {
      it("should successfully add media and revalidate", async () => {
        const mockMedia = {
          title: "Boda Ana",
          url: "https://images.com/1.jpg",
          type: "IMAGE",
          category: "Weddings",
        };

        await addMedia(mockMedia);

        expect(prisma.media.create).toHaveBeenCalledWith({
          data: mockMedia,
        });
        expect(revalidatePath).toHaveBeenCalledWith("/");
      });

      it("should successfully delete media and revalidate", async () => {
        await deleteMedia("media-789");

        expect(prisma.media.delete).toHaveBeenCalledWith({
          where: { id: "media-789" },
        });
        expect(revalidatePath).toHaveBeenCalledWith("/");
      });
    });

    describe("Service Operations", () => {
      it("should successfully add service and revalidate", async () => {
        const mockService = {
          title: "Sesión Exterior",
          description: "Sesión de fotos al aire libre",
          price: "150 USD",
          icon: "camera",
        };

        await addService(mockService);

        expect(prisma.service.create).toHaveBeenCalledWith({
          data: mockService,
        });
        expect(revalidatePath).toHaveBeenCalledWith("/");
      });

      it("should successfully update service and revalidate", async () => {
        const updateData = { title: "Nuevo Título", price: "200 USD" };

        await updateService("srv-123", updateData);

        expect(prisma.service.update).toHaveBeenCalledWith({
          where: { id: "srv-123" },
          data: updateData,
        });
        expect(revalidatePath).toHaveBeenCalledWith("/");
      });

      it("should successfully delete service and revalidate", async () => {
        await deleteService("srv-123");

        expect(prisma.service.delete).toHaveBeenCalledWith({
          where: { id: "srv-123" },
        });
        expect(revalidatePath).toHaveBeenCalledWith("/");
      });
    });
  });
});
