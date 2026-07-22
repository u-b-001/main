'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Media } from '@/components/Media';
import Link from 'next/link';
import { cn } from '@/utilities/ui';

export const StackedCarousel = ({ slides }: { slides: any[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    // Sync background color with parent FlexibleRow
    const activeSlide = slides[currentIndex];
    if (activeSlide?.backgroundColor && activeSlide.backgroundColor !== 'transparent') {
      const parentRow = document.querySelector('.block-flexible-row') as HTMLElement;
      if (parentRow) {
        parentRow.style.transition = 'background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        parentRow.style.backgroundColor = activeSlide.backgroundColor.startsWith('#') 
          ? activeSlide.backgroundColor 
          : `#${activeSlide.backgroundColor}`;
      }
    }
  }, [currentIndex, slides]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative w-full h-full min-h-[550px] md:min-h-[650px] flex items-center justify-start lg:justify-center overflow-visible perspective-[1200px]">
      <div className="relative w-full max-w-[320px] sm:max-w-[360px] md:max-w-[420px] aspect-[3/4] md:aspect-[4/5] mx-auto md:ml-0 lg:mx-auto z-20">
        <AnimatePresence initial={false} mode="popLayout">
          {slides.map((slide, index) => {
            let relativeIndex = index - currentIndex;
            if (relativeIndex < 0) {
              relativeIndex += slides.length;
            }

            const isActive = relativeIndex === 0;
            const isVisible = relativeIndex >= 0 && relativeIndex < 3;
            // The card just before the active one is leaving to the left
            const isLeaving = index === (currentIndex - 1 + slides.length) % slides.length && slides.length > 1;

            if (!isVisible && !isLeaving) return null;

            let xOffset = 0;
            let scale = 1;
            let rotateY = 0;
            let rotateZ = 0;
            let opacity = 1;
            let zIndex = 30;

            if (isActive) {
              xOffset = 0;
              scale = 1;
              rotateY = 0;
              rotateZ = 0;
              opacity = 1;
              zIndex = 30;
            } else if (isLeaving) {
              xOffset = -200;
              scale = 0.8;
              rotateY = 15;
              rotateZ = -5;
              opacity = 0;
              zIndex = 40; // Needs to be above to exit nicely
            } else {
              // Stacked cards
              xOffset = relativeIndex * 140; // Shift right
              scale = 1 - relativeIndex * 0.12; 
              rotateZ = relativeIndex * 3; 
              opacity = 1 - relativeIndex * 0.15;
              zIndex = 30 - relativeIndex * 10;
            }

            // On mobile, reduce the horizontal shift so they fit on screen
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            if (isMobile && !isActive && !isLeaving) {
              xOffset = relativeIndex * 60;
            }

            return (
              <motion.div
                key={index}
                className={cn(
                  "absolute inset-0 rounded-[32px] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]",
                  !isActive ? "cursor-pointer hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]" : ""
                )}
                style={{ originX: 0.5, originY: 0.5, zIndex }}
                initial={{ opacity: 0, scale: 0.8, x: 300, rotateZ: 10 }}
                animate={{ 
                  x: xOffset, 
                  scale, 
                  rotateY,
                  rotateZ, 
                  opacity,
                  zIndex,
                }}
                exit={{ opacity: 0, scale: 0.8, x: -300, rotateZ: -10 }}
                transition={{ type: 'spring', stiffness: 220, damping: 28, mass: 1.2 }}
                onClick={() => {
                  if (!isActive && !isLeaving) {
                    setCurrentIndex(index);
                  }
                }}
              >
                {/* Background Image / Video */}
                <div className="absolute inset-0 w-full h-full bg-gray-900 z-0">
                  {(!slide.mediaType || slide.mediaType === 'image') && slide.image && typeof slide.image === 'object' && slide.image.url && (
                    <img src={slide.image.url} alt={slide.image.alt || ''} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  {slide.mediaType === 'video' && slide.video && typeof slide.video === 'object' && (
                    <video src={slide.video.url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                  )}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Card Content */}
                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between text-white pointer-events-none z-10">
                  <div className="flex justify-start">
                    {slide.category && (
                      <motion.span 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -10 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#ff4000] text-white text-xs font-bold px-3 py-1.5 uppercase tracking-widest rounded shadow-md"
                      >
                        {slide.category}
                      </motion.span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 md:gap-3">
                    {slide.title && (
                      <motion.h3 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isActive ? 1 : 0.6, y: isActive ? 0 : 10 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-md"
                      >
                        {slide.title}
                      </motion.h3>
                    )}
                    {slide.subtitle && (
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm md:text-base text-white/90 font-medium drop-shadow-md"
                      >
                        {slide.subtitle}
                      </motion.p>
                    )}
                    
                    {slide.buttonText && slide.buttonLink && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.9 }}
                        transition={{ delay: 0.3 }}
                        className="mt-3 md:mt-5 pointer-events-auto origin-left"
                      >
                        <Link href={slide.buttonLink} className="inline-flex items-center gap-3 text-white text-sm md:text-base font-semibold hover:text-[#ff4000] transition-colors group">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white group-hover:border-[#ff4000] flex items-center justify-center transition-colors">
                            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                          </div>
                          {slide.buttonText}
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </div>
                
                {/* Active card subtle inner border/glow */}
                {isActive && (
                  <div className="absolute inset-0 rounded-[32px] border border-white/20 pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute -bottom-20 left-0 w-full flex justify-center gap-6 z-40">
          <button 
            onClick={prevSlide}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center bg-black/20 backdrop-blur-md hover:bg-black/40 transition-all shadow-lg active:scale-95"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button 
            onClick={nextSlide}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center bg-black/20 backdrop-blur-md hover:bg-black/40 transition-all shadow-lg active:scale-95"
            aria-label="Next Slide"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
