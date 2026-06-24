import React from 'react'
import { getHomepageData, getLatestNews, getGalleryImages, getFeaturedEvents } from '@/lib/queries'
import { HeroCarousel } from '@/components/home/HeroCarousel'
import { ServicesGrid } from '@/components/home/ServicesGrid'
import { NewsSection } from '@/components/home/NewsSection'
import { GallerySection } from '@/components/home/GallerySection'
import { PastEventsSection } from '@/components/home/PastEventsSection'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getHomepageData()
  return {
    title: settings?.siteName || 'MOSAI',
    description: settings?.siteTagline || 'Mombusho Scholars Association of India',
  }
}

export default async function HomePage() {
  const { homepage } = await getHomepageData()

  // Retrieve slider slides
  const slides = homepage?.carousel || []

  // Retrieve service cards
  const services = homepage?.services || []

  // Find limits for dynamic blocks or fallback
  let newsLimit = homepage?.newsDisplayCount || 8
  let galleryLimit = homepage?.galleryDisplayCount || 4
  let eventsLimit = homepage?.eventsDisplayCount || 2

  if (homepage?.layout && Array.isArray(homepage.layout)) {
    const newsBlock = homepage.layout.find((b: any) => b.blockType === 'news') as any
    if (newsBlock) newsLimit = newsBlock.limit || 8

    const galleryBlock = homepage.layout.find((b: any) => b.blockType === 'gallery') as any
    if (galleryBlock) galleryLimit = galleryBlock.limit || 4

    const eventsBlock = homepage.layout.find((b: any) => b.blockType === 'events') as any
    if (eventsBlock) eventsLimit = eventsBlock.limit || 2
  }

  // Fetch news items
  const newsResult = await getLatestNews(newsLimit)
  const newsItems = newsResult.docs || []

  // Fetch gallery images (fetch up to 100 to enable client-side View More toggle)
  const galleryResult = await getGalleryImages(100)
  const galleryImages = galleryResult.docs || []

  // Fetch past events
  const eventsResult = await getFeaturedEvents(eventsLimit)
  const events = eventsResult.docs || []

  const renderLayoutBlocks = () => {
    if (!homepage?.layout || !Array.isArray(homepage.layout) || homepage.layout.length === 0) {
      // FALLBACK: render default hardcoded sections in the standard order
      return (
        <>
          {/* 1. Hero Carousel */}
          <HeroCarousel
            slides={slides as any}
            height={homepage?.carouselHeight || 'medium'}
            layout={homepage?.carouselLayout || 'fullWidth'}
            autoplay={homepage?.carouselAutoplay !== false}
            autoplayInterval={homepage?.carouselAutoplayInterval || 5000}
            imageOpacity={homepage?.carouselImageOpacity || '100'}
          />

          {/* 2. "We Offer" Services Grid */}
          <ServicesGrid
            heading={homepage?.offersHeading || 'WE OFFER'}
            headingAlignment={homepage?.offersHeadingAlignment || 'center'}
            headingSize={homepage?.offersHeadingSize || 'medium'}
            services={services as any}
            backgroundColor="slate"
            showUnderline={true}
          />

          {/* 3. News & Notifications Section */}
          <NewsSection
            heading={homepage?.newsHeading || 'NEWS & NOTIFICATIONS'}
            headingAlignment={homepage?.newsHeadingAlignment || 'center'}
            headingSize={homepage?.newsHeadingSize || 'medium'}
            subheading={homepage?.newsSubheading ?? undefined}
            newsItems={newsItems}
            viewAllLink={homepage?.newsViewAllLink || '/news'}
            backgroundColor="white"
            showUnderline={true}
          />

          {/* 4. Gallery Section */}
          <GallerySection
            heading={homepage?.galleryHeading || 'MOSAI Gallery'}
            headingAlignment={homepage?.galleryHeadingAlignment || 'center'}
            headingSize={homepage?.galleryHeadingSize || 'medium'}
            images={galleryImages}
            displayCount={homepage?.galleryDisplayCount || 4}
            backgroundColor="slate"
            showUnderline={true}
          />

          {/* 5. Past Events Section */}
          <PastEventsSection
            heading={homepage?.eventsHeading || 'Our Past Events'}
            headingAlignment={homepage?.eventsHeadingAlignment || 'center'}
            headingSize={homepage?.eventsHeadingSize || 'medium'}
            events={events}
            backgroundColor="white"
            showUnderline={true}
          />
        </>
      )
    }

    return homepage.layout.map((block: any, idx: number) => {
      switch (block.blockType) {
        case 'carousel':
          return (
            <HeroCarousel
              key={idx}
              slides={(block.slides || []) as any}
              height={block.carouselHeight || 'medium'}
              layout={block.carouselLayout || 'fullWidth'}
              autoplay={block.carouselAutoplay !== false}
              autoplayInterval={block.carouselAutoplayInterval || 5000}
              imageOpacity={block.carouselImageOpacity || '100'}
            />
          )
        case 'services':
          return (
            <ServicesGrid
              key={idx}
              heading={block.heading || 'WE OFFER'}
              headingAlignment={block.align || 'center'}
              headingSize={block.size || 'medium'}
              services={(block.services || []) as any}
              backgroundColor={block.bg}
              showUnderline={block.showUnderline !== false}
            />
          )
        case 'news':
          return (
            <NewsSection
              key={idx}
              heading={block.heading || 'NEWS & NOTIFICATIONS'}
              headingAlignment={block.align || 'center'}
              headingSize={block.size || 'medium'}
              subheading={block.newsSubheading ?? undefined}
              newsItems={newsItems}
              viewAllLink={block.newsViewAllLink || '/news'}
              viewAllLabel={block.newsViewAllLabel}
              backgroundColor={block.bg}
              showUnderline={block.showUnderline !== false}
            />
          )
        case 'gallery':
          return (
            <GallerySection
              key={idx}
              heading={block.heading || 'MOSAI Gallery'}
              headingAlignment={block.align || 'center'}
              headingSize={block.size || 'medium'}
              images={galleryImages}
              displayCount={block.limit || 4}
              viewAllLabel={block.galleryViewAllLabel}
              backgroundColor={block.bg}
              showUnderline={block.showUnderline !== false}
            />
          )
        case 'events':
          return (
            <PastEventsSection
              key={idx}
              heading={block.heading || 'Our Past Events'}
              headingAlignment={block.align || 'center'}
              headingSize={block.size || 'medium'}
              events={events}
              backgroundColor={block.bg}
              showUnderline={block.showUnderline !== false}
            />
          )
        default:
          return null
      }
    })
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {renderLayoutBlocks()}
    </main>
  )
}
