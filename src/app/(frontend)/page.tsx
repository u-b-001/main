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

  // Fetch news items
  const newsLimit = homepage?.newsDisplayCount || 8
  const newsResult = await getLatestNews(newsLimit)
  const newsItems = newsResult.docs || []

  // Fetch gallery images
  const galleryLimit = homepage?.galleryDisplayCount || 8
  const galleryResult = await getGalleryImages(galleryLimit)
  const galleryImages = galleryResult.docs || []

  // Fetch past events
  const eventsLimit = homepage?.eventsDisplayCount || 2
  const eventsResult = await getFeaturedEvents(eventsLimit)
  const events = eventsResult.docs || []

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {/* 1. Hero Carousel */}
      <HeroCarousel slides={slides as any} />

      {/* 2. "We Offer" Services Grid */}
      <ServicesGrid
        heading={homepage?.offersHeading || 'WE OFFER'}
        services={services as any}
      />

      {/* 3. News & Notifications Section */}
      <NewsSection
        heading={homepage?.newsHeading || 'NEWS & NOTIFICATIONS'}
        subheading={homepage?.newsSubheading ?? undefined}
        newsItems={newsItems}
        viewAllLink={homepage?.newsViewAllLink || '/news'}
      />

      {/* 4. Gallery Section */}
      <GallerySection
        heading={homepage?.galleryHeading || 'MOSAI Gallery'}
        images={galleryImages}
        displayCount={homepage?.galleryDisplayCount || 8}
      />

      {/* 5. Past Events Section */}
      <PastEventsSection
        heading={homepage?.eventsHeading || 'Our Past Events'}
        events={events}
      />
    </main>
  )
}
