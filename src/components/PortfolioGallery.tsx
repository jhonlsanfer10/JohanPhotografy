"use client";

import { useState } from "react";
import styles from "./PortfolioGallery.module.css";
import { X } from "lucide-react";

type MediaItem = {
  id: string;
  url: string;
  title: string;
  category: string;
  type: string;
};

export default function PortfolioGallery({ media, lang }: { media: MediaItem[], lang: string }) {
  const [filter, setFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(media.map(m => m.category))).filter(Boolean)];

  const filteredMedia = filter === "All" ? media : media.filter(m => m.category === filter);

  return (
    <div className={styles.wrapper}>
      {/* Filter Menu */}
      <div className={styles.filterMenu}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className={styles.masonryGrid}>
        {filteredMedia.map((item, idx) => (
          <div 
            key={item.id} 
            className={styles.masonryItem}
            onClick={() => setLightboxIndex(idx)}
          >
            {item.type === "IMAGE" || !item.type ? (
              <img src={item.url} alt={item.title} className={styles.masonryImage} loading="lazy" />
            ) : (
              <video src={item.url} className={styles.masonryImage} muted loop playsInline autoPlay />
            )}
            <div className={styles.overlay}>
              <span className="font-serif">{item.title}</span>
            </div>
          </div>
        ))}
        {filteredMedia.length === 0 && (
          <p style={{ textAlign: 'center', width: '100%', padding: '2rem', color: 'var(--text-muted)' }}>
            {lang === 'en' ? 'No media found.' : 'No se encontraron fotos.'}
          </p>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className={styles.lightbox} onClick={() => setLightboxIndex(null)}>
          <button className={styles.closeBtn} onClick={() => setLightboxIndex(null)}>
            <X size={32} strokeWidth={1} />
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            {filteredMedia[lightboxIndex].type === "IMAGE" || !filteredMedia[lightboxIndex].type ? (
              <img src={filteredMedia[lightboxIndex].url} alt={filteredMedia[lightboxIndex].title} />
            ) : (
              <video src={filteredMedia[lightboxIndex].url} controls autoPlay />
            )}
            <div className={styles.lightboxCaption}>
              <h3>{filteredMedia[lightboxIndex].title}</h3>
              <span>{filteredMedia[lightboxIndex].category}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
