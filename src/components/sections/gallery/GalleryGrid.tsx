'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '@/components/ui/Container';
import GalleryCard from './GalleryCard';
import Lightbox from './Lightbox';
import { GalleryItem, GALLERY_CATEGORIES, GalleryCategory } from '@/types/gallery';

interface GalleryGridProps {
  initialItems: GalleryItem[];
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ initialItems }) => {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'All Works'>('All Works');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [lightboxType, setLightboxType] = useState<'main' | 'before' | 'after'>('main');

  // Filter items based on active category
  const filteredItems = initialItems.filter((item) => {
    if (activeCategory === 'All Works') return true;
    return item.category === activeCategory;
  });

  const categoriesList: ('All Works' | GalleryCategory)[] = ['All Works', ...GALLERY_CATEGORIES];

  const handleOpenLightbox = (item: GalleryItem, type?: 'main' | 'before' | 'after') => {
    setSelectedItem(item);
    setLightboxType(type || 'main');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as any },
    },
  };

  return (
    <section className="py-8 pb-20 md:pb-24 bg-bg overflow-hidden text-center">
      <Container>
        {/* Category Filter Bar */}
        <div className="flex flex-wrap justify-center items-center gap-2.5 mb-16 max-w-3xl mx-auto font-sans text-sm">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 cursor-pointer shadow-sm border ${
                activeCategory === cat
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white hover:bg-slate-50 text-body-text border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bento Grid layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95 }}
                className={item.variant === 'comparison' || item.variant === 'wideSplit' ? 'lg:col-span-2' : 'lg:col-span-1'}
              >
                <GalleryCard item={item} onOpenLightbox={handleOpenLightbox} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="py-20 text-center text-body-text font-sans">
            No transformations published in this category yet.
          </div>
        )}
      </Container>

      {/* Full screen Lightbox */}
      <Lightbox
        item={selectedItem}
        initialType={lightboxType}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
};

export default GalleryGrid;
