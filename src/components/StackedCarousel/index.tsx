'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utilities/ui';

interface Slide {
  mediaType?: 'image' | 'video' | 'youtube';
  image?: { url?: string; alt?: string } | string;
  video?: { url?: string } | string;
  youtubeUrl?: string;
  title?: string;
  subtitle?: string;
  category?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
  caption?: string;
}

interface StackedCarouselProps {
  slides: Slide[];
  autoplay?: boolean;
  interval?: number;
}

export const StackedCarousel = ({
  slides,
  autoplay = true,
  interval = 5000,
}: StackedCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto slide effect using infinite monotonic sequence index
  useEffect(() => {
    if (!autoplay || isHovered || !slides || slides.length <= 1) return;
    const autoInterval = interval && interval >= 1000 ? interval : 5000;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, autoInterval);

    return () => clearInterval(timer);
  }, [autoplay, interval, slides, isHovered]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      } else {
        setContainerWidth(window.innerWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    if (!slides || slides.length === 0) return;
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (!slides || slides.length === 0) return;
    setCurrentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    // Sync background color with parent FlexibleRow if configured
    if (!slides || slides.length === 0) return;
    const activeSlideIndex = ((currentIndex % slides.length) + slides.length) % slides.length;
    const activeSlide = slides[activeSlideIndex];
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

  const cardHeight = isMobile ? 380 : 460;
  const total = slides.length;

  // Render slots [-2, -1, 0, 1, 2, 3] for smooth transitions, showing exactly 3 visible cards [0, 1, 2]
  const visibleRelativeOffsets = [-2, -1, 0, 1, 2, 3];

  const getCardPropsForRel = (rel: number) => {
    const isActive = rel === 0;

    const gap = isMobile ? 8 : 14;

    // Sequential width decrease: Main (wide, ~58%), 2nd Image (~18.5%), 3rd Right Peek (~12%), Left Peek (~10%)
    const activeWidth = isMobile
      ? Math.min(234, containerWidth * 0.65)
      : Math.min(700, containerWidth * 0.58);

    const sideWidth1 = isMobile
      ? Math.min(72, containerWidth * 0.20)
      : Math.min(220, containerWidth * 0.185);

    const sideWidth2 = isMobile
      ? Math.min(46, containerWidth * 0.13)
      : Math.min(145, containerWidth * 0.12);

    const leftPeekWidth = isMobile
      ? Math.min(42, containerWidth * 0.12)
      : Math.min(120, containerWidth * 0.10);

    // X center positions calculated relative to container center (0)
    // Left peek right edge sits at (-containerWidth / 2 + leftPeekVisibleOffset)
    const leftPeekRight = -containerWidth / 2 + (isMobile ? 20 : 40);
    const activeStartLeft = leftPeekRight + gap;

    let width = activeWidth;
    let centerX = 0;

    if (rel === 0) {
      width = activeWidth;
      centerX = activeStartLeft + activeWidth / 2;
    } else if (rel === 1) {
      width = sideWidth1;
      const prevRight = activeStartLeft + activeWidth;
      centerX = prevRight + gap + sideWidth1 / 2;
    } else if (rel === 2) {
      width = sideWidth2;
      const prevRight = activeStartLeft + activeWidth + gap + sideWidth1;
      centerX = prevRight + gap + sideWidth2 / 2;
    } else if (rel === -1) {
      width = leftPeekWidth;
      centerX = leftPeekRight - leftPeekWidth / 2;
    } else if (rel > 2) {
      width = sideWidth2 * 0.7;
      const prevRight = activeStartLeft + activeWidth + gap + sideWidth1 + gap + sideWidth2;
      centerX = prevRight + (rel - 2) * (width + gap) + width / 2;
    } else {
      // rel < -1 (exiting to far left)
      width = leftPeekWidth * 0.7;
      centerX = (leftPeekRight - leftPeekWidth) - (-rel - 1) * (width + gap) - width / 2;
    }

    // Opacity: rel = -1 (0.70 left peek), rel = 0 (1.0 main), rel = 1 (0.95 next), rel = 2 (0.70 right peek)
    let opacity = 0;
    if (rel === 0) {
      opacity = 1;
    } else if (rel === 1) {
      opacity = 0.95;
    } else if (rel === -1) {
      opacity = 0.70;
    } else if (rel === 2) {
      opacity = 0.70;
    } else {
      opacity = 0;
    }

    const zIndex = 30 - Math.abs(rel) * 2;

    return {
      isActive,
      width,
      centerX,
      opacity,
      zIndex,
    };
  };

  return (
    <div 
      className="relative w-full py-8 md:py-12 overflow-hidden flex flex-col items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel Viewport Container */}
      <div 
        ref={containerRef}
        className="relative w-full flex items-center justify-center"
        style={{ height: `${cardHeight + 20}px` }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {visibleRelativeOffsets.map((rel) => {
            const absPos = currentIndex + rel;
            const slideIndex = ((absPos % total) + total) % total;
            const slide = slides[slideIndex];
            if (!slide) return null;

            const { isActive, width, centerX, opacity, zIndex } = getCardPropsForRel(rel);

            const categoryText = slide.category?.trim();
            const isGallery = categoryText ? (categoryText.toUpperCase().includes('GALLERY') || categoryText.toUpperCase().includes('PHOTO')) : false;
            const badgeBg = isGallery ? 'bg-[#ff7700]' : 'bg-[#ff2200]';

            const imageUrl = typeof slide.image === 'object' ? slide.image?.url : slide.image;
            const videoUrl = typeof slide.video === 'object' ? slide.video?.url : slide.video;

            return (
              <motion.div
                key={absPos}
                className={cn(
                  'absolute rounded-[28px] md:rounded-[32px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border border-white/10 group select-none',
                  !isActive ? 'cursor-pointer hover:border-white/30 hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7)]' : ''
                )}
                style={{
                  height: `${cardHeight}px`,
                  zIndex,
                  pointerEvents: opacity > 0.1 ? 'auto' : 'none',
                }}
                initial={false}
                animate={{
                  x: centerX,
                  width: width,
                  opacity: opacity,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 240,
                  damping: 26,
                  mass: 0.9,
                }}
                onClick={() => {
                  if (!isActive) {
                    setCurrentIndex(absPos);
                  }
                }}
              >
                {/* Media Background */}
                <div className="absolute inset-0 w-full h-full bg-slate-900 z-0">
                  {(!slide.mediaType || slide.mediaType === 'image') && imageUrl && (
                    <img
                      src={imageUrl}
                      alt={(typeof slide.image === 'object' && slide.image?.alt) || slide.title || ''}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  {slide.mediaType === 'video' && videoUrl && (
                    <video
                      src={videoUrl}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  )}
                  {slide.mediaType === 'youtube' && slide.youtubeUrl && (
                    <iframe
                      src={slide.youtubeUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-full border-0 pointer-events-none"
                    />
                  )}
                </div>

                {/* Optional subtle bottom overlay only if title/text exists */}
                {(slide.title || slide.subtitle) && (
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />
                )}

                {/* Badge Tag (Top Left) - Only shown if category is defined */}
                {categoryText && (
                  <div className="absolute top-5 left-5 md:top-7 md:left-7 z-20">
                    <span className={cn(
                      "text-white text-[10px] md:text-xs font-black tracking-widest px-3 py-1.5 rounded-sm uppercase shadow-md inline-block",
                      badgeBg
                    )}>
                      {categoryText}
                    </span>
                  </div>
                )}

                {/* Bottom Content Area */}
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 flex flex-col justify-end text-white z-20 pointer-events-none">
                  {slide.title && (
                    <motion.h3
                      className={cn(
                        "font-extrabold leading-snug tracking-tight drop-shadow-md text-white line-clamp-3 mb-2",
                        isActive ? "text-xl sm:text-2xl md:text-3xl lg:text-4xl" : "text-base sm:text-lg md:text-xl opacity-90"
                      )}
                    >
                      {slide.title}
                    </motion.h3>
                  )}

                  {slide.subtitle && (
                    <motion.p
                      className={cn(
                        "text-xs md:text-sm text-white/75 font-medium mb-4 drop-shadow",
                        !isActive && "line-clamp-1"
                      )}
                    >
                      {slide.subtitle}
                    </motion.p>
                  )}

                  {/* Read More Link - Only shown if buttonText or buttonLink is explicitly provided */}
                  {(slide.buttonText || slide.buttonLink) && (
                    <div className="pt-1 pointer-events-auto">
                      {slide.buttonLink ? (
                        <Link
                          href={slide.buttonLink}
                          className="inline-flex items-center gap-2.5 text-white font-semibold text-xs md:text-sm group/link hover:text-white/80 transition-colors"
                        >
                          <div className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-white/90 flex items-center justify-center bg-white/10 group-hover/link:bg-white/20 transition-all">
                            <ArrowRight size={13} className="text-white group-hover/link:translate-x-0.5 transition-transform" />
                          </div>
                          <span>{slide.buttonText || 'Read more'}</span>
                        </Link>
                      ) : (
                        <div className="inline-flex items-center gap-2.5 text-white font-semibold text-xs md:text-sm">
                          <div className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-white/90 flex items-center justify-center bg-white/10">
                            <ArrowRight size={13} className="text-white" />
                          </div>
                          <span>{slide.buttonText}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Subtle active glow frame */}
                {isActive && (
                  <div className="absolute inset-0 rounded-[28px] md:rounded-[32px] border border-white/25 pointer-events-none z-30" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6 z-40">
          <button
            onClick={prevSlide}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all shadow-lg active:scale-95 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={nextSlide}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all shadow-lg active:scale-95 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
};
