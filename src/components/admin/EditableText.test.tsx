import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditableText from "./EditableText";
import { useTheme } from "../ThemeProvider";
import { updateContent } from "@/app/actions/admin";
import React from "react";

// Mock imports
vi.mock("../ThemeProvider", () => ({
  useTheme: vi.fn(),
}));

vi.mock("@/app/actions/admin", () => ({
  updateContent: vi.fn(),
}));

// Mock window.alert
const mockAlert = vi.fn();
vi.stubGlobal("alert", mockAlert);

describe("EditableText Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTheme).mockReturnValue({ theme: "dark", setTheme: vi.fn() });
  });

  describe("Non-Admin Mode", () => {
    it("should render content statically and not allow editing", () => {
      render(
        <EditableText
          contentKey="test_key"
          initialValue="Hello World"
          isAdmin={false}
        />
      );

      const element = screen.getByText("Hello World");
      expect(element).toBeInTheDocument();
      expect(screen.queryByText("✏️")).not.toBeInTheDocument();

      // Click should not trigger editing
      fireEvent.click(element);
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });

    it("should format newlines as <br/>", () => {
      render(
        <EditableText
          contentKey="test_key"
          initialValue={"Line 1\nLine 2"}
          isAdmin={false}
        />
      );

      const element = screen.getByText((content, node) => {
        return node?.innerHTML === "Line 1<br>Line 2";
      });
      expect(element).toBeInTheDocument();
    });
  });

  describe("Admin Mode", () => {
    it("should render editable icon and enter edit mode on click", () => {
      render(
        <EditableText
          contentKey="test_key"
          initialValue="Editable Title"
          isAdmin={true}
        />
      );

      expect(screen.getByText("✏️")).toBeInTheDocument();
      
      const clickTarget = screen.getByTitle("Clic para editar");
      fireEvent.click(clickTarget);

      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toHaveValue("Editable Title");
      expect(screen.getByText("Guardar")).toBeInTheDocument();
      expect(screen.getByText("Cancelar")).toBeInTheDocument();
    });

    it("should cancel edit mode without saving on Cancel click", () => {
      render(
        <EditableText
          contentKey="test_key"
          initialValue="Original Val"
          isAdmin={true}
        />
      );

      fireEvent.click(screen.getByTitle("Clic para editar"));
      const textarea = screen.getByRole("textbox");
      fireEvent.change(textarea, { target: { value: "Changed Val" } });
      
      fireEvent.click(screen.getByText("Cancelar"));

      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      expect(screen.getByText("Original Val")).toBeInTheDocument();
      expect(updateContent).not.toHaveBeenCalled();
    });

    it("should save changes and exit edit mode when Guardar is clicked", async () => {
      vi.mocked(updateContent).mockResolvedValue(undefined);

      render(
        <EditableText
          contentKey="test_key"
          initialValue="Old Title"
          isAdmin={true}
        />
      );

      fireEvent.click(screen.getByTitle("Clic para editar"));
      const textarea = screen.getByRole("textbox");
      fireEvent.change(textarea, { target: { value: "New Title" } });
      
      fireEvent.click(screen.getByText("Guardar"));

      expect(screen.getByText("Guardando...")).toBeInTheDocument();

      await waitFor(() => {
        expect(updateContent).toHaveBeenCalledWith("test_key", "New Title");
      });

      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      expect(screen.getByText("New Title")).toBeInTheDocument();
    });

    it("should save custom text color if color changes", async () => {
      vi.mocked(updateContent).mockResolvedValue(undefined);

      render(
        <EditableText
          contentKey="test_key"
          initialValue="Color Title"
          initialColor="#ff0000"
          isAdmin={true}
        />
      );

      fireEvent.click(screen.getByTitle("Clic para editar"));
      const colorPicker = screen.getByTitle("Color del texto");
      fireEvent.change(colorPicker, { target: { value: "#00ff00" } });
      
      fireEvent.click(screen.getByText("Guardar"));

      await waitFor(() => {
        expect(updateContent).toHaveBeenCalledWith("test_key", "Color Title");
        expect(updateContent).toHaveBeenCalledWith("test_key_color", "#00ff00");
      });
    });

    it("should display alert on save error", async () => {
      vi.mocked(updateContent).mockRejectedValue(new Error("Network Error"));

      render(
        <EditableText
          contentKey="test_key"
          initialValue="Title"
          isAdmin={true}
        />
      );

      fireEvent.click(screen.getByTitle("Clic para editar"));
      fireEvent.click(screen.getByText("Guardar"));

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith("Error guardando el contenido. Revisa tu conexión.");
      });
    });
  });

  describe("Adaptive Color Logic", () => {
    it("should keep initial color on dark theme", () => {
      vi.mocked(useTheme).mockReturnValue({ theme: "dark", setTheme: vi.fn() });

      render(
        <EditableText
          contentKey="test_key"
          initialValue="White Text"
          initialColor="#ffffff"
          adaptive={true}
          isAdmin={false}
        />
      );

      const span = screen.getByText("White Text");
      expect(span).toHaveStyle({ color: "#ffffff" });
    });

    it("should fallback to var(--text-main) on light theme if color is too light (luminance > 0.7)", () => {
      vi.mocked(useTheme).mockReturnValue({ theme: "light", setTheme: vi.fn() });

      render(
        <EditableText
          contentKey="test_key"
          initialValue="White Text Light Theme"
          initialColor="#ffffff" // White: very high luminance
          adaptive={true}
          isAdmin={false}
        />
      );

      const span = screen.getByText("White Text Light Theme");
      expect(span).toHaveStyle({ color: "var(--text-main)" });
    });

    it("should preserve color on light theme if color is dark enough (luminance <= 0.7)", () => {
      vi.mocked(useTheme).mockReturnValue({ theme: "light", setTheme: vi.fn() });

      render(
        <EditableText
          contentKey="test_key"
          initialValue="Dark Text Light Theme"
          initialColor="#333333" // Dark grey: low luminance
          adaptive={true}
          isAdmin={false}
        />
      );

      const span = screen.getByText("Dark Text Light Theme");
      expect(span).toHaveStyle({ color: "#333333" });
    });
  });
});
