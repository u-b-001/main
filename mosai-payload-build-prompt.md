# MOSAI Website — Payload CMS Build Prompt

> Reference site: [https://mosai.org.in](https://mosai.org.in)
> Stack: **Payload CMS 3.x** + **Next.js 15 (App Router)** + **PostgreSQL** + **TypeScript**

---

## 1. Project Overview

Build a full-stack website for **MOSAI (Mombusho Scholars Association of India)** — an Indian society promoting educational and cultural ties between India and Japan. The site handles Japanese language institute admissions, examination registrations (JLPT/EJU), scholarship programs, gallery, news, events, and membership.

Migrate this from a Grav flat-file CMS to Payload CMS with Next.js as the frontend.

---

## 2. Tech Stack & Initialization

```bash
# Bootstrap Payload 3 with Next.js
npx create-payload-app@latest mosai-website \
  --template website \
  --db postgres

cd mosai-website
npm install
```

**Dependencies to add:**
```bash
npm install sharp slugify date-fns
```

**Environment variables (`.env`):**
```env
DATABASE_URI=postgresql://user:pass@localhost:5432/mosai
PAYLOAD_SECRET=your-secret-here
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

---

## 3. Payload Collections

### 3.1 `media` (built-in, extend)

```ts
// collections/Media.ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'public/media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1920, height: 800, position: 'centre' },
      { name: 'gallery', width: 600, height: 450, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf'],
  },
  admin: { group: 'Media' },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { name: 'caption', type: 'text' },
  ],
}
```

---

### 3.2 `pages` (flexible page builder)

```ts
// collections/Pages.ts
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'hero',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Banner image shown at the top of inner pages' },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        RichTextBlock,
        ImageWithTextBlock,
        InfoCardBlock,
        TableBlock,
        EmbedBlock,
        CallToActionBlock,
      ],
    },
    {
      name: 'seo',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
```

---

### 3.3 `news` (News & Notifications)

```ts
// collections/News.ts
import type { CollectionConfig } from 'payload'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'tag', 'publishedAt', 'status'],
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'tag',
      type: 'select',
      required: true,
      options: [
        { label: 'Announcement', value: 'ANNOUNCEMENT' },
        { label: 'Event',        value: 'EVENT' },
        { label: 'Opportunity',  value: 'OPPORTUNITY' },
        { label: 'Result',       value: 'RESULT' },
        { label: 'Notice',       value: 'NOTICE' },
      ],
    },
    { name: 'excerpt', type: 'textarea', required: true,
      admin: { description: 'Short description shown in the notification list' } },
    { name: 'slug', type: 'text', unique: true, required: true },
    {
      name: 'content',
      type: 'richText',
      admin: { description: 'Full content (shown on the detail page)' },
    },
    {
      name: 'externalLink',
      type: 'text',
      admin: { description: 'If set, clicking the card redirects here instead of an internal page' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Pin to top of list' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft',     value: 'draft' },
        { label: 'Archived',  value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
```

---

### 3.4 `gallery` (Photo Gallery)

```ts
// collections/Gallery.ts
import type { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'title',
    group: 'Media',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'album',
      type: 'text',
      admin: { description: 'Group images by album/event name (optional)' },
    },
    { name: 'date', type: 'date' },
    { name: 'order', type: 'number', defaultValue: 0,
      admin: { position: 'sidebar' } },
  ],
}
```

---

### 3.5 `events` (Past Events / Videos)

```ts
// collections/Events.ts
import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'eventDate', 'featured'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'youtubeUrl',
      type: 'text',
      required: true,
      admin: { description: 'Paste the full YouTube embed URL (https://www.youtube.com/embed/VIDEO_ID)' },
    },
    { name: 'eventDate', type: 'date' },
    { name: 'organizer', type: 'text', defaultValue: 'Organized by MOSAI' },
    { name: 'description', type: 'textarea' },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on homepage Past Events section' },
    },
  ],
}
```

---

### 3.6 `services` ("We Offer" Cards)

```ts
// collections/Services.ts
import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'excerpt', type: 'textarea', required: true },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'link',
      type: 'text',
      required: true,
      admin: { description: 'Internal slug or external URL for the "Read More" button' },
    },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
```

---

### 3.7 `committee` (Managing Committee)

```ts
// collections/Committee.ts
import type { CollectionConfig } from 'payload'

export const Committee: CollectionConfig = {
  slug: 'committee',
  admin: {
    useAsTitle: 'name',
    group: 'Organisation',
    defaultColumns: ['name', 'role', 'order'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true,
      admin: { description: 'e.g. President, Secretary General, Treasurer' } },
    { name: 'designation', type: 'text',
      admin: { description: 'Professional designation / institution' } },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'bio', type: 'richText' },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Managing Committee', value: 'committee' },
        { label: 'Advisory Board',     value: 'advisory' },
        { label: 'Faculty',            value: 'faculty' },
      ],
    },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
```

---

### 3.8 `users` (Admin users — built-in, extend)

```ts
// collections/Users.ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Super Admin', value: 'superAdmin' },
        { label: 'Editor',      value: 'editor' },
      ],
      defaultValue: 'editor',
      admin: { position: 'sidebar' },
    },
  ],
}
```

---

## 4. Payload Globals

### 4.1 `header` Global (Navigation)

```ts
// globals/Header.ts
import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'nav',
      type: 'array',
      label: 'Navigation Items',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'link',  type: 'text' },
        { name: 'openInNewTab', type: 'checkbox', defaultValue: false },
        {
          name: 'children',
          type: 'array',
          label: 'Dropdown Items',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'link',  type: 'text', required: true },
            { name: 'openInNewTab', type: 'checkbox', defaultValue: false },
            {
              name: 'subChildren',
              type: 'array',
              label: 'Sub-dropdown Items',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'link',  type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

Seed the navigation with this exact structure:
- Home (`/`)
- About Mosai (`/about-mosai`) → The Association, President's Message, Managing Committee, Association With SAFJUAA
- Japanese Language (`/japanese-language`) → About Institute, Admission BJ-II/IJ/AJ, Advisory Board & Faculty, Course Content & Teaching Method, Rules & Regulation, Placement Cell, Admission In Basic Japanese
- Examination & Contest (`/examination-and-contest`) → EJU Examination & Scholarship (sub: Result EJU Nov 2025), EJU June 2026, EJU Travel Scholarship, JLPT July-2026, Japanese Language Speech Contest (JLSC), JLPT July-2026 Admit Card & Test Schedule, 37th All India JLSC
- Study In Japan (`/study-in-japan`) → Counselling Cell, How to Join Japanese Universities, Mitsui Scholarship Program-2026
- Publications (`/publications`)
- Membership (`/membership`) → Becoming a Member, Members Directory
- Kizuna India-Japan Study Forum (`https://www.kizunamosai.in`, external)

---

### 4.2 `footer` Global

```ts
// globals/Footer.ts
import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Site Settings' },
  fields: [
    { name: 'organizationName', type: 'text', defaultValue: 'MOMBUSHO SCHOLARS ASSOCIATION OF INDIA' },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'facebook',  type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'linkedin',  type: 'text' },
        { name: 'youtube',   type: 'text' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'email',   type: 'email' },
        { name: 'phone',   type: 'text' },
        { name: 'address', type: 'textarea' },
      ],
    },
    { name: 'copyright', type: 'text',
      defaultValue: '© 2026 MOSAI - Mombusho Scholars Association of India. All rights reserved.' },
    {
      name: 'showVisitorCounter',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Show the visitor statistics block in the footer' },
    },
    {
      name: 'showCalendar',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
```

---

### 4.3 `homepage` Global (Homepage sections)

```ts
// globals/Homepage.ts
import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  admin: { group: 'Site Settings' },
  fields: [
    // -- Hero Carousel --
    {
      name: 'carousel',
      type: 'array',
      label: 'Hero Carousel Slides',
      maxRows: 10,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt',   type: 'text' },
        { name: 'link',  type: 'text',
          admin: { description: 'Optional: clicking the slide goes here' } },
      ],
    },

    // -- "We Offer" Section --
    {
      name: 'offersHeading',
      type: 'text',
      defaultValue: 'WE OFFER',
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { description: 'Select up to 4 service cards to display' },
    },

    // -- News Section --
    {
      name: 'newsHeading',    type: 'text', defaultValue: 'NEWS & NOTIFICATIONS' },
    {
      name: 'newsSubheading', type: 'text',
      defaultValue: 'Stay updated with the latest news, announcements, and achievements from MOSAI.',
    },
    { name: 'newsDisplayCount', type: 'number', defaultValue: 8,
      admin: { description: 'How many notification items to show on the homepage' } },
    { name: 'newsViewAllLink', type: 'text', defaultValue: '/news' },

    // -- Gallery Section --
    { name: 'galleryHeading', type: 'text', defaultValue: 'MOSAI Gallery' },
    { name: 'galleryDisplayCount', type: 'number', defaultValue: 8 },

    // -- Past Events Section --
    { name: 'eventsHeading', type: 'text', defaultValue: 'Our Past Events' },
    { name: 'eventsDisplayCount', type: 'number', defaultValue: 2 },
  ],
}
```

---

### 4.4 `siteSettings` Global

```ts
// globals/SiteSettings.ts
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  admin: { group: 'Site Settings' },
  fields: [
    { name: 'siteName',    type: 'text', defaultValue: 'MOSAI' },
    { name: 'siteTagline', type: 'text', defaultValue: 'Mombusho Scholars Association of India' },
    { name: 'favicon',     type: 'upload', relationTo: 'media' },
    { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
    { name: 'googleAnalyticsId', type: 'text' },
  ],
}
```

---

## 5. Page Builder Blocks

Define these reusable blocks in `src/blocks/`:

### 5.1 `RichTextBlock`
```ts
{
  slug: 'richText',
  fields: [
    { name: 'content', type: 'richText', required: true },
  ],
}
```

### 5.2 `ImageWithTextBlock`
```ts
{
  slug: 'imageWithText',
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    { name: 'imagePosition', type: 'select',
      options: ['left', 'right'], defaultValue: 'right' },
    { name: 'content', type: 'richText', required: true },
  ],
}
```

### 5.3 `InfoCardBlock`
```ts
{
  slug: 'infoCard',
  fields: [
    { name: 'title',   type: 'text' },
    { name: 'content', type: 'richText' },
    {
      name: 'style',
      type: 'select',
      options: ['default', 'highlight', 'warning'],
      defaultValue: 'default',
    },
  ],
}
```

### 5.4 `TableBlock`
```ts
{
  slug: 'table',
  fields: [
    { name: 'caption', type: 'text' },
    {
      name: 'rows',
      type: 'array',
      fields: [
        { name: 'isHeader', type: 'checkbox', defaultValue: false },
        {
          name: 'cells',
          type: 'array',
          fields: [{ name: 'value', type: 'text' }],
        },
      ],
    },
  ],
}
```

### 5.5 `EmbedBlock`
```ts
{
  slug: 'embed',
  fields: [
    { name: 'url', type: 'text', required: true,
      admin: { description: 'YouTube embed URL or Google Form embed URL' } },
    { name: 'height', type: 'number', defaultValue: 400 },
    { name: 'title',  type: 'text' },
  ],
}
```

### 5.6 `CallToActionBlock`
```ts
{
  slug: 'cta',
  fields: [
    { name: 'heading',    type: 'text' },
    { name: 'body',       type: 'textarea' },
    { name: 'buttonText', type: 'text' },
    { name: 'buttonLink', type: 'text' },
    { name: 'buttonStyle', type: 'select',
      options: ['primary', 'secondary', 'outline'], defaultValue: 'primary' },
  ],
}
```

---

## 6. Next.js Frontend Pages

### File Structure
```
src/
  app/
    (frontend)/
      page.tsx                         ← Homepage
      about-mosai/
        page.tsx
        the-association/page.tsx
        presidents-message/page.tsx
        managing-committee/page.tsx
        association-with-safjuaa/page.tsx
      japanese-language/
        page.tsx
        about-institute/page.tsx
        admission-for-bj2-ij-and-aj-session-2026/page.tsx
        advisory-board-and-faculty/page.tsx
        course-content-and-teaching-method/page.tsx
        rules-and-regulation/page.tsx
        placement-cell/page.tsx
        admission-in-basic-japanese/page.tsx
      examination-and-contest/
        page.tsx
        eju-examination-and-scholarship/
          page.tsx
          eju-november-2025/page.tsx
        eju-june-2026/page.tsx
        eju-travel-scholarship/page.tsx
        jlpt-july-2026/page.tsx
        japanese-language-speech-contest-jlsc/page.tsx
        jlpt-july-2026-admit-card/page.tsx
        37th-all-india-jlsc/page.tsx
      study-in-japan/
        page.tsx
        counselling-cell/page.tsx
        how-to-join-japanese-universities/page.tsx
        mitsui-scholarship-program-2026/page.tsx
      publications/page.tsx
      membership/
        page.tsx
        becoming-a-member/page.tsx
        members-directory/page.tsx
      kizuna-india-japan-study-forum/page.tsx
      news/
        page.tsx
        [slug]/page.tsx
      gallery/page.tsx
    (payload)/
      admin/[[...segments]]/page.tsx   ← Payload Admin
  components/
    layout/
      Header.tsx
      Footer.tsx
      MobileMenu.tsx
    home/
      HeroCarousel.tsx
      ServicesGrid.tsx
      NewsSection.tsx
      GallerySection.tsx
      PastEventsSection.tsx
    shared/
      NewsCard.tsx
      GalleryGrid.tsx
      RichTextRenderer.tsx
      YouTubeEmbed.tsx
      PageHero.tsx
      Breadcrumb.tsx
    blocks/
      RichTextBlock.tsx
      ImageWithTextBlock.tsx
      InfoCardBlock.tsx
      TableBlock.tsx
      EmbedBlock.tsx
      CtaBlock.tsx
  lib/
    payload.ts           ← getPayloadClient singleton
    queries.ts           ← reusable data-fetching functions
```

---

## 7. Key Component Specifications

### 7.1 Header / Navigation

- Fixed top, white background with box-shadow on scroll
- Logo left-aligned (links to `/`)
- Desktop: horizontal nav with dropdown menus on hover (mega-nav for 3-level items)
- Mobile: hamburger icon → full-screen slide-in menu with accordion dropdowns
- Active link highlighted

```tsx
// components/layout/Header.tsx
'use client'
// Fetch `header` global from Payload
// Render logo + nav items
// 3-level dropdown: top nav → dropdown → sub-dropdown
// Highlight active route with usePathname()
```

---

### 7.2 Hero Carousel (Homepage)

- Full-width, auto-playing image slideshow
- 5–6 slides from the `homepage` global's `carousel` array
- Smooth fade or slide transition (CSS transition or a headless library like `embla-carousel-react`)
- Dot navigation indicators at the bottom
- Pause on hover
- Mobile-responsive (same images, different aspect ratios via CSS)

```tsx
// components/home/HeroCarousel.tsx
// Props: slides: Array<{ image: Media; alt: string; link?: string }>
```

---

### 7.3 Services Grid ("We Offer")

- Section heading "WE OFFER" — centered, uppercase
- 4-column grid on desktop, 2-column on tablet, 1-column on mobile
- Each card: image (top) → title → excerpt → "Read More" link
- Cards have hover shadow effect

```tsx
// components/home/ServicesGrid.tsx
// Props: heading: string; services: Service[]
```

---

### 7.4 News & Notifications Section (Homepage)

- Section heading + subtitle
- Vertical list of notification items, each showing:
  - Colored badge/pill for tag (ANNOUNCEMENT = blue, EVENT = green, OPPORTUNITY = orange, RESULT = purple)
  - Title as a clickable link (internal slug or externalLink)
  - Excerpt (1–2 lines, truncated)
- "View All Notifications" button at the bottom
- Fetch latest N items from `news` collection (sorted by `publishedAt` desc, `featured` first)

```tsx
// components/home/NewsSection.tsx
```

---

### 7.5 Gallery Section (Homepage)

- Section heading "MOSAI Gallery"
- 4-column image grid (2 rows visible by default = 8 images)
- "View All Images" button to reveal remaining images in-place (toggle)
- "Show Less" button to collapse
- Click on image opens a lightbox modal

```tsx
// components/home/GallerySection.tsx
// Use native dialog element or a headless library for lightbox
```

---

### 7.6 Past Events Section (Homepage)

- Section heading "Our Past Events"
- 2 YouTube video embeds side by side (responsive iframes with `aspect-ratio: 16/9`)
- Below each video: date, organizer, social share buttons (Facebook, Twitter/X)

```tsx
// components/home/PastEventsSection.tsx
// Props: events: Event[]  (featured events only)
```

---

### 7.7 Footer

Four-column layout on desktop, stacked on mobile:

**Column 1 — Organization**
- MOMBUSHO SCHOLARS ASSOCIATION OF INDIA (bold heading)
- Social icons row: Facebook, Instagram, LinkedIn, YouTube (SVG icons, links to social profiles)

**Column 2 — Contact**
- Email section heading → clickable email link
- Phone section heading → phone numbers
- Address section heading → address text

**Column 3 — Visitor Counter**
- Section heading "VISITORS"
- Stats list: Today, Yesterday, This Week, This Month, Total, Currently Online
- Implement a simple visitor counter using Payload's custom endpoints or an external service (e.g., GoatCounter)

**Column 4 — Calendar**
- Mini month calendar widget
- Navigate between months with « » arrows
- Highlight today's date

**Bottom bar:**
- Full-width copyright text, centered

---

### 7.8 Inner Page Layout

All non-home pages share this layout:
1. `<PageHero>` — full-width banner image (from the page's `hero` field) with the page title overlaid
2. `<Breadcrumb>` — auto-generated from URL path
3. Main content area — renders the `layout` blocks array
4. Sidebar (on desktop) — optional: can include a navigation list for the current section

---

### 7.9 News/Notifications Archive Page (`/news`)

- Page heading "News & Notifications"
- Filter bar: All | Announcement | Event | Opportunity | Result (tabs or pills)
- Paginated list of `NewsCard` components (12 per page)
- Each `NewsCard`: tag badge, title, date, excerpt, "Read More" link

---

### 7.10 Gallery Page (`/gallery`)

- Full responsive masonry or uniform grid of all gallery images
- Album filter (dropdown or tabs) if albums are assigned
- Lightbox on click

---

### 7.11 Membership Page (`/membership`)

- Eligibility info block with bullet points
- Fee table
- CTA button → Google Form link for membership application
- Contact address

---

### 7.12 Managing Committee Page

- Grid of committee member cards
- Each card: photo (round avatar), name, role/designation
- Separate section for Advisory Board and Faculty (use the `type` field)

---

## 8. Payload Configuration Entry Point

```ts
// payload.config.ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Media }     from './collections/Media'
import { Pages }     from './collections/Pages'
import { News }      from './collections/News'
import { Gallery }   from './collections/Gallery'
import { Events }    from './collections/Events'
import { Services }  from './collections/Services'
import { Committee } from './collections/Committee'
import { Users }     from './collections/Users'
import { Header }    from './globals/Header'
import { Footer }    from './globals/Footer'
import { Homepage }  from './globals/Homepage'
import { SiteSettings } from './globals/SiteSettings'

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— MOSAI Admin',
      favicon: '/favicon.ico',
    },
  },
  editor: lexicalEditor({}),
  collections: [Media, Pages, News, Gallery, Events, Services, Committee, Users],
  globals: [Header, Footer, Homepage, SiteSettings],
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
  }),
  plugins: [
    seoPlugin({
      collections: ['pages', 'news'],
      uploadsCollection: 'media',
    }),
  ],
  typescript: { outputFile: 'src/payload-types.ts' },
  graphQL: { disable: true },
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || ''],
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || ''],
})
```

---

## 9. Data Fetching Helpers

```ts
// src/lib/queries.ts
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getHomepageData() {
  const payload = await getPayload({ config: configPromise })
  const [homepage, header, footer, settings] = await Promise.all([
    payload.findGlobal({ slug: 'homepage', depth: 2 }),
    payload.findGlobal({ slug: 'header',   depth: 2 }),
    payload.findGlobal({ slug: 'footer',   depth: 1 }),
    payload.findGlobal({ slug: 'siteSettings', depth: 1 }),
  ])
  return { homepage, header, footer, settings }
}

export async function getLatestNews(limit = 8) {
  const payload = await getPayload({ config: configPromise })
  return payload.find({
    collection: 'news',
    limit,
    sort: '-publishedAt',
    where: { status: { equals: 'published' } },
  })
}

export async function getGalleryImages(limit = 8) {
  const payload = await getPayload({ config: configPromise })
  return payload.find({
    collection: 'gallery',
    limit,
    sort: 'order',
  })
}

export async function getFeaturedEvents(limit = 2) {
  const payload = await getPayload({ config: configPromise })
  return payload.find({
    collection: 'events',
    limit,
    where: { featured: { equals: true } },
    sort: '-eventDate',
  })
}

export async function getPageBySlug(slug: string) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 3,
  })
  return result.docs[0] ?? null
}
```

---

## 10. Styling Guidelines

Use **Tailwind CSS** (included in the Payload website template) with a custom palette inspired by MOSAI's identity:

```ts
// tailwind.config.ts — extend theme
colors: {
  brand: {
    red:       '#C0392B',   // Primary — Japanese red (torii gate)
    navy:      '#1A2B4A',   // Dark navy — deep trust
    gold:      '#C9A84C',   // Gold accent — Japan crest/seal
    cream:     '#FAF6F0',   // Off-white background
    lightgray: '#F2F2F2',   // Card backgrounds
    text:      '#2C2C2C',   // Body text
  },
}
```

Typography choices:
- **Display / Headings:** `Noto Serif JP` (Google Fonts) — subtle Japanese aesthetic
- **Body:** `Inter` — clean, readable
- Import in `src/app/layout.tsx` via `next/font/google`

---

## 11. Access Control

```ts
// Simple role-based access
const isSuperAdmin = ({ req: { user } }) =>
  user?.role === 'superAdmin'

const isEditor = ({ req: { user } }) =>
  ['superAdmin', 'editor'].includes(user?.role)

// Apply to collections:
// - news, pages, events, gallery, services, committee:
//   read: public; create/update/delete: isEditor
// - users, globals:
//   all operations: isSuperAdmin
```

---

## 12. Seed Script

Create `src/seed.ts` to populate:
1. Site Settings global (name, tagline)
2. Header global with the full navigation tree (see Section 4.1)
3. Footer global with MOSAI contact details and social links
4. 4 Service cards (Japanese Language Institute, JLPT, EJU, Study In Japan)
5. 8 news items (one per tag type)
6. 2 featured events (YouTube URLs from the current site)
7. 8 gallery placeholder entries

```bash
npx ts-node src/seed.ts
```

---

## 13. Deployment Notes

- **Hosting:** Vercel (frontend + Payload in Next.js route handler) + Neon or Supabase (PostgreSQL)
- **Media:** Vercel Blob or AWS S3 via `@payloadcms/storage-s3`
- **Environment:** Set `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `S3_*` vars in Vercel dashboard
- **Redirects:** Add Next.js `redirects()` in `next.config.ts` to map old Grav URLs to new slugs

---

## 14. Pages to Build (Checklist)

| Route | Source Page | Content Type |
|---|---|---|
| `/` | Home | Global (homepage) |
| `/about-mosai` | About Mosai | Pages collection |
| `/about-mosai/the-association` | The Association | Pages |
| `/about-mosai/presidents-message` | President's Message | Pages |
| `/about-mosai/managing-committee` | Managing Committee | Committee collection |
| `/about-mosai/association-with-safjuaa` | SAFJUAA | Pages |
| `/japanese-language` | Japanese Language | Pages |
| `/japanese-language/about-institute` | About Institute | Pages |
| `/japanese-language/admission-for-bj2-ij-and-aj-session-2026` | Admission BJ-II | Pages |
| `/japanese-language/advisory-board-and-faculty` | Faculty | Committee collection |
| `/japanese-language/course-content-and-teaching-method` | Course Content | Pages |
| `/japanese-language/rules-and-regulation` | Rules | Pages |
| `/japanese-language/placement-cell` | Placement Cell | Pages |
| `/japanese-language/admission-in-basic-japanese` | BJ Admission | Pages |
| `/examination-and-contest` | Exam & Contest | Pages |
| `/examination-and-contest/eju-examination-and-scholarship` | EJU | Pages |
| `/examination-and-contest/eju-examination-and-scholarship/eju-november-2025` | EJU Result | Pages |
| `/examination-and-contest/eju-june-2026` | EJU June 2026 | Pages |
| `/examination-and-contest/eju-travel-scholarship` | EJU Scholarship | Pages |
| `/examination-and-contest/jlpt-july-2026` | JLPT July 2026 | Pages |
| `/examination-and-contest/japanese-language-speech-contest-jlsc` | JLSC | Pages |
| `/examination-and-contest/jlpt-july-2026-admit-card` | JLPT Admit Card | Pages |
| `/examination-and-contest/37th-all-india-jlsc` | 37th JLSC | Pages |
| `/study-in-japan` | Study In Japan | Pages |
| `/study-in-japan/counselling-cell` | Counselling | Pages |
| `/study-in-japan/how-to-join-japanese-universities` | How to Join | Pages |
| `/study-in-japan/mitsui-scholarship-program-2026` | Mitsui Scholarship | Pages |
| `/publications` | Publications | Pages |
| `/membership` | Membership | Pages |
| `/membership/becoming-a-member` | Become a Member | Pages |
| `/membership/members-directory` | Members Directory | Pages |
| `/kizuna-india-japan-study-forum` | Kizuna Forum | External redirect |
| `/news` | News Archive | Dynamic (news collection) |
| `/news/[slug]` | News Detail | Dynamic (news collection) |
| `/gallery` | Gallery | Dynamic (gallery collection) |

---

## 15. Quick Start Checklist

- [ ] Run `create-payload-app` and install deps
- [ ] Create all 8 collections (`Media`, `Pages`, `News`, `Gallery`, `Events`, `Services`, `Committee`, `Users`)
- [ ] Create 4 globals (`Header`, `Footer`, `Homepage`, `SiteSettings`)
- [ ] Define 6 blocks in `src/blocks/`
- [ ] Scaffold Next.js page files for all routes in Section 14
- [ ] Build shared components (`Header`, `Footer`, `HeroCarousel`, `ServicesGrid`, `NewsSection`, `GallerySection`, `PastEventsSection`, `PageHero`)
- [ ] Configure Tailwind with MOSAI color palette and Google Fonts
- [ ] Run seed script to populate initial content
- [ ] Test admin panel at `/admin`
- [ ] Add SEO plugin and verify meta tags
- [ ] Configure deployment on Vercel + Neon

---

*Generated by analyzing https://mosai.org.in — June 2026*
