"use client";

import { useState } from "react";
import { updateContent } from "@/app/actions/admin";
import styles from "./EditableText.module.css";
import { useTheme } from "../ThemeProvider";

export default function EditableText({
  contentKey,
  initialValue,
  initialColor = "inherit",
  adaptive = false,
  isAdmin,
  as: Component = "span",
  className,
}: {
  contentKey: string;
  initialValue: string;
  initialColor?: string;
  adaptive?: boolean;
  isAdmin: boolean;
  as?: React.ElementType;
  className?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [color, setColor] = useState(initialColor);
  const [isSaving, setIsSaving] = useState(false);
  
  const { theme } = useTheme();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateContent(contentKey, value);
      if (color !== initialColor) {
        await updateContent(`${contentKey}_color`, color);
      }
      setIsEditing(false);
    } catch (_e) {
      alert("Error guardando el contenido. Revisa tu conexión.");
    }
    setIsSaving(false);
  };

  let finalColor = color;
  if (color !== 'inherit' && adaptive && theme === 'light') {
    if (color.length === 7) {
      const r = parseInt(color.substring(1, 3), 16);
      const g = parseInt(color.substring(3, 5), 16);
      const b = parseInt(color.substring(5, 7), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      if (luminance > 0.7) {
        finalColor = "var(--text-main)"; // Fallback to dark text
      }
    }
  }

  if (!isAdmin) {
    return <Component className={className} style={{ color: finalColor !== 'inherit' ? finalColor : undefined }} dangerouslySetInnerHTML={{ __html: initialValue.replace(/\n/g, '<br/>') }} />
  }

  if (isEditing) {
    return (
      <div className={styles.editorWrapper}>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={styles.textarea}
          autoFocus
        />
        <div className={styles.actions}>
          <input 
            type="color" 
            value={color === 'inherit' ? '#000000' : color} 
            onChange={e => setColor(e.target.value)} 
            className={styles.colorPicker} 
            title="Color del texto"
          />
          <button onClick={handleSave} disabled={isSaving} className={styles.btnSave}>
            {isSaving ? "Guardando..." : "Guardar"}
          </button>
          <button onClick={() => setIsEditing(false)} className={styles.btnCancel}>Cancelar</button>
        </div>
      </div>
    );
  }

  return (
    <Component
      className={`${className} ${styles.editable}`}
      onClick={() => setIsEditing(true)}
      title="Clic para editar"
      style={{ color: finalColor !== 'inherit' ? finalColor : undefined }}
    >
      <span dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, '<br/>') }} />
      <span className={styles.editIcon}>✏️</span>
    </Component>
  );
}
