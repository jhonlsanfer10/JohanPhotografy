/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
            className={`${styles.filterBtn} ${filter === cat ? styles.active : ''} clickable`}
            onClick={() => setFilter(cat)}
          >
            {cat}
            {filter === cat && (
              <motion.div 
                layoutId="active-filter" 
                className={styles.activeFilterIndicator} 
                style={{ position: 'absolute', bottom: 0, left: 0, height: '1px', background: 'var(--accent-color)', width: '100%' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <motion.div layout className={styles.masonryGrid}>
        <AnimatePresence mode="popLayout">
          {filteredMedia.map((item, idx) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
              key={item.id} 
              className={`${styles.masonryItem} clickable`}
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
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredMedia.length === 0 && (
          <p style={{ textAlign: 'center', width: '100%', padding: '2rem', color: 'var(--text-muted)' }}>
            {lang === 'en' ? 'No media found.' : 'No se encontraron fotos.'}
          </p>
        )}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.lightbox} 
            onClick={() => setLightboxIndex(null)}
          >
            <button className={`${styles.closeBtn} clickable`} onClick={() => setLightboxIndex(null)}>
              <X size={32} strokeWidth={1} />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={styles.lightboxContent} 
              onClick={(e) => e.stopPropagation()}
            >
              {filteredMedia[lightboxIndex].type === "IMAGE" || !filteredMedia[lightboxIndex].type ? (
                <img src={filteredMedia[lightboxIndex].url} alt={filteredMedia[lightboxIndex].title} />
              ) : (
                <video src={filteredMedia[lightboxIndex].url} controls autoPlay />
              )}
              <div className={styles.lightboxCaption}>
                <h3>{filteredMedia[lightboxIndex].title}</h3>
                <span>{filteredMedia[lightboxIndex].category}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
