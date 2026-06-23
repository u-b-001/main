import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

const collections: CollectionSlug[] = [
  'media',
  'pages',
  'news',
  'gallery',
  'events',
  'services',
  'committee',
]

const globals: GlobalSlug[] = ['header', 'footer', 'homepage', 'siteSettings']

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database for MOSAI...')

  payload.logger.info(`— Clearing collections and globals...`)


  // Clear collections
  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  // Clear collection versions
  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  // Clear demo users
  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'admin@mosai.org.in',
      },
    },
  })

  payload.logger.info(`— Seeding superAdmin user...`)
  await payload.create({
    collection: 'users',
    data: {
      name: 'Super Admin',
      email: 'admin@mosai.org.in',
      password: 'password123',
      role: 'superAdmin',
    },
  })

  payload.logger.info(`— Seeding media...`)
  let imageHeroBuffer: File
  try {
    imageHeroBuffer = await fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-hero1.webp',
    )
  } catch (error) {
    payload.logger.error('Failed to fetch remote image, fallback to mock buffer')
    imageHeroBuffer = {
      name: 'fallback.jpg',
      data: Buffer.alloc(100),
      mimetype: 'image/jpeg',
      size: 100,
    }
  }

  const mediaDoc = await payload.create({
    collection: 'media',
    data: { alt: 'MOSAI Banner Image', caption: 'Japan-India Relations' },
    file: imageHeroBuffer,
  })

  const mediaAvatarDoc = await payload.create({
    collection: 'media',
    data: { alt: 'Member Avatar Placeholder', caption: 'Profile Photo' },
    file: imageHeroBuffer,
  })

  payload.logger.info(`— Seeding siteSettings global...`)
  await payload.updateGlobal({
    slug: 'siteSettings',
    data: {
      siteName: 'MOSAI',
      siteTagline: 'Mombusho Scholars Association of India',
      favicon: mediaDoc.id,
      defaultOgImage: mediaDoc.id,
    },
  })

  payload.logger.info(`— Seeding services (We Offer cards)...`)
  const serviceCardsData = [
    { title: 'Japanese Language Institute', excerpt: 'Offering basic to advanced courses in Japanese, BJ-II, IJ, and AJ programs with certification.', link: '/japanese-language/about-institute' },
    { title: 'JLPT Examinations', excerpt: 'MOSAI conducts the Japanese Language Proficiency Test in cooperation with the Japan Foundation.', link: '/examination-and-contest/jlpt-july-2026' },
    { title: 'EJU Examinations & Scholarship', excerpt: 'Examination for Japanese University Admission for International Students andSAFJUAA scholarship guides.', link: '/examination-and-contest/eju-examination-and-scholarship' },
    { title: 'Study In Japan', excerpt: 'Counselling cells and university information sessions for Indian students looking to study in Japan.', link: '/study-in-japan' },
  ]

  const serviceDocs = []
  for (let i = 0; i < serviceCardsData.length; i++) {
    const card = serviceCardsData[i]
    const doc = await payload.create({
      collection: 'services',
      data: {
        title: card.title,
        excerpt: card.excerpt,
        image: mediaDoc.id,
        link: card.link,
        order: i,
      },
    })
    serviceDocs.push(doc.id)
  }

  payload.logger.info(`— Seeding events (YouTube URLs)...`)
  const eventsData = [
    { title: 'MOSAI All India Japanese Language Speech Contest', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', eventDate: '2026-03-15', organizer: 'Organized by MOSAI', description: 'National level speech contest bringing outstanding speakers from all over India.', featured: true },
    { title: 'Indo-Japan Academic & Cultural Ties Seminar', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', eventDate: '2026-05-10', organizer: 'Organized by MOSAI & Embassy of Japan', description: 'A seminar discussing collaborative educational programs between Indian and Japanese universities.', featured: true },
  ]
  for (const event of eventsData) {
    await payload.create({
      collection: 'events',
      data: event,
    })
  }

  payload.logger.info(`— Seeding gallery placeholders...`)
  for (let i = 1; i <= 8; i++) {
    await payload.create({
      collection: 'gallery',
      data: {
        title: `Event Activity Photo ${i}`,
        image: mediaDoc.id,
        album: i <= 4 ? 'JLSC Speech Contest' : 'Japanese Language Institute',
        date: '2026-04-20',
        order: i,
      },
    })
  }

  payload.logger.info(`— Seeding news archive (one per tag type)...`)
  const newsData = [
    { title: 'Admissions Open for Japanese Classes 2026', tag: 'ANNOUNCEMENT', excerpt: 'Registration for basic Japanese language course starts next Monday. Limited seats.', slug: 'admissions-open-2026', publishedAt: '2026-06-01T09:00:00.000Z', featured: true },
    { title: 'JLPT July 2026 Schedule & Test Guide', tag: 'NOTICE', excerpt: 'Test schedules and admit card details for all exam centers are now available.', slug: 'jlpt-july-2026-schedule', publishedAt: '2026-06-10T10:00:00.000Z', featured: true },
    { title: 'EJU Scholarships Results November 2025 Out', tag: 'RESULT', excerpt: 'Check the official merit list of candidates selected for EJU Nov 2025 travel scholarships.', slug: 'eju-results-nov-2025', publishedAt: '2026-06-15T12:00:00.000Z', featured: false },
    { title: 'Mitsui & Co. Scholarship Program 2026', tag: 'OPPORTUNITY', excerpt: 'Applications are open for Mitsui scholarship program for Indian students who want to study in Japan.', slug: 'mitsui-scholarship-program-2026', publishedAt: '2026-06-18T14:00:00.000Z', featured: true },
    { title: '37th All India Japanese Speech Contest Highlights', tag: 'EVENT', excerpt: 'The contest was held at the India International Centre, New Delhi. Read highlights.', slug: 'speech-contest-highlights', publishedAt: '2026-06-20T16:00:00.000Z', featured: false },
  ] as const
  for (const news of newsData) {
    await payload.create({
      collection: 'news',
      data: {
        title: news.title,
        tag: news.tag,
        excerpt: news.excerpt,
        slug: news.slug,
        publishedAt: news.publishedAt,
        featured: news.featured,
        status: 'published',
        content: {
          root: {
            children: [
              {
                children: [{ detail: 0, format: 0, mode: 'normal', text: `This is the full article content for ${news.title}. It has detailed reports and resources.`, type: 'text', version: 1 }],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'root',
            version: 1,
          },
        },
      },
    })
  }

  payload.logger.info(`— Seeding managing committee, advisory board, and faculty...`)
  const committeeData = [
    { name: 'Dr. Ashok Chawla', role: 'President', designation: 'Advisor (Japan), MEA', type: 'committee', order: 1 },
    { name: 'Mr. Sandeep Kaushik', role: 'Secretary General', designation: 'Former MEXT Scholar', type: 'committee', order: 2 },
    { name: 'Prof. J.V. Raman', role: 'Advisory Member', designation: 'Professor of Japanese, JNU', type: 'advisory', order: 1 },
    { name: 'Sensei Keiko Tanaka', role: 'Head Faculty', designation: 'Native Japanese Language Instructor', type: 'faculty', order: 1 },
  ] as const
  for (const member of committeeData) {
    await payload.create({
      collection: 'committee',
      data: {
        ...member,
        photo: mediaAvatarDoc.id,
        bio: {
          root: {
            children: [
              {
                children: [{ detail: 0, format: 0, mode: 'normal', text: `${member.name} serves as ${member.role} helping build Indo-Japanese academic bridges.`, type: 'text', version: 1 }],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'root',
            version: 1,
          },
        },
      },
    })
  }

  payload.logger.info(`— Seeding pages (Home, About, Japanese Language, etc.)...`)
  
  // 1. Seed dynamic pages first to link in nav
  const associationPage = await payload.create({
    collection: 'pages',
    data: {
      title: 'The Association',
      slug: 'about-mosai/the-association',
      hero: mediaDoc.id,
      layout: [
        {
          blockType: 'richText',
          content: {
            root: {
              children: [
                {
                  children: [{ detail: 0, format: 0, mode: 'normal', text: 'MOSAI (Mombusho Scholars Association of India) was established in 1989 as a society registered under the Societies Registration Act. It is an association of former recipients of the Mombusho (now MEXT) Scholarships of the Government of Japan.', type: 'text', version: 1 }],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  type: 'paragraph',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'root',
              version: 1,
            },
          },
        },
      ],
    },
  })

  const institutePage = await payload.create({
    collection: 'pages',
    data: {
      title: 'About Institute',
      slug: 'japanese-language/about-institute',
      hero: mediaDoc.id,
      layout: [
        {
          blockType: 'richText',
          content: {
            root: {
              children: [
                {
                  children: [{ detail: 0, format: 0, mode: 'normal', text: 'The MOSAI Japanese Language Institute provides structured training for students and professionals looking to gain proficiency in the Japanese Language.', type: 'text', version: 1 }],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  type: 'paragraph',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'root',
              version: 1,
            },
          },
        },
      ],
    },
  })

  // Placeholder pages for other links in the nav tree to ensure they render and resolve
  const slugsList = [
    'about-mosai',
    'about-mosai/presidents-message',
    'about-mosai/managing-committee',
    'about-mosai/association-with-safjuaa',
    'japanese-language',
    'japanese-language/admission-for-bj2-ij-and-aj-session-2026',
    'japanese-language/advisory-board-and-faculty',
    'japanese-language/course-content-and-teaching-method',
    'japanese-language/rules-and-regulation',
    'japanese-language/placement-cell',
    'japanese-language/admission-in-basic-japanese',
    'examination-and-contest',
    'examination-and-contest/eju-examination-and-scholarship',
    'examination-and-contest/eju-examination-and-scholarship/eju-november-2025',
    'examination-and-contest/eju-june-2026',
    'examination-and-contest/eju-travel-scholarship',
    'examination-and-contest/jlpt-july-2026',
    'examination-and-contest/japanese-language-speech-contest-jlsc',
    'examination-and-contest/jlpt-july-2026-admit-card',
    'examination-and-contest/37th-all-india-jlsc',
    'study-in-japan',
    'study-in-japan/counselling-cell',
    'study-in-japan/how-to-join-japanese-universities',
    'study-in-japan/mitsui-scholarship-program-2026',
    'publications',
    'membership',
    'membership/becoming-a-member',
    'membership/members-directory',
  ]

  for (const slug of slugsList) {
    const title = slug.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || slug
    await payload.create({
      collection: 'pages',
      data: {
        title,
        slug,
        hero: mediaDoc.id,
        layout: [
          {
            blockType: 'richText',
            content: {
              root: {
                children: [
                  {
                    children: [{ detail: 0, format: 0, mode: 'normal', text: `Welcome to the ${title} page. This content is fully configurable via Payload CMS.`, type: 'text', version: 1 }],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'paragraph',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'root',
                version: 1,
              },
            },
          },
        ],
      },
    })
  }

  payload.logger.info(`— Seeding homepage global...`)
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      carousel: [
        { image: mediaDoc.id, alt: 'Slide 1', link: '/about-mosai' },
        { image: mediaDoc.id, alt: 'Slide 2', link: '/japanese-language' },
      ],
      offersHeading: 'WE OFFER',
      services: serviceDocs,
      newsHeading: 'NEWS & NOTIFICATIONS',
      newsSubheading: 'Stay updated with the latest news, announcements, and achievements from MOSAI.',
      newsDisplayCount: 6,
      newsViewAllLink: '/news',
      galleryHeading: 'MOSAI Gallery',
      galleryDisplayCount: 8,
      eventsHeading: 'Our Past Events',
      eventsDisplayCount: 2,
    },
  })

  payload.logger.info(`— Seeding Header global (Section 4.1 tree structure)...`)
  await payload.updateGlobal({
    slug: 'header',
    data: {
      logo: mediaDoc.id,
      nav: [
        { label: 'Home', link: '/', openInNewTab: false },
        {
          label: 'About Mosai',
          link: '/about-mosai',
          openInNewTab: false,
          children: [
            { label: 'The Association', link: '/about-mosai/the-association', openInNewTab: false },
            { label: "President's Message", link: '/about-mosai/presidents-message', openInNewTab: false },
            { label: 'Managing Committee', link: '/about-mosai/managing-committee', openInNewTab: false },
            { label: 'Association With SAFJUAA', link: '/about-mosai/association-with-safjuaa', openInNewTab: false },
          ],
        },
        {
          label: 'Japanese Language',
          link: '/japanese-language',
          openInNewTab: false,
          children: [
            { label: 'About Institute', link: '/japanese-language/about-institute', openInNewTab: false },
            { label: 'Admission BJ-II/IJ/AJ', link: '/japanese-language/admission-for-bj2-ij-and-aj-session-2026', openInNewTab: false },
            { label: 'Advisory Board & Faculty', link: '/japanese-language/advisory-board-and-faculty', openInNewTab: false },
            { label: 'Course Content & Teaching Method', link: '/japanese-language/course-content-and-teaching-method', openInNewTab: false },
            { label: 'Rules & Regulation', link: '/japanese-language/rules-and-regulation', openInNewTab: false },
            { label: 'Placement Cell', link: '/japanese-language/placement-cell', openInNewTab: false },
            { label: 'Admission In Basic Japanese', link: '/japanese-language/admission-in-basic-japanese', openInNewTab: false },
          ],
        },
        {
          label: 'Examination & Contest',
          link: '/examination-and-contest',
          openInNewTab: false,
          children: [
            {
              label: 'EJU Examination & Scholarship',
              link: '/examination-and-contest/eju-examination-and-scholarship',
              openInNewTab: false,
              subChildren: [
                { label: 'Result EJU Nov 2025', link: '/examination-and-contest/eju-examination-and-scholarship/eju-november-2025' },
              ],
            },
            { label: 'EJU June 2026', link: '/examination-and-contest/eju-june-2026', openInNewTab: false },
            { label: 'EJU Travel Scholarship', link: '/examination-and-contest/eju-travel-scholarship', openInNewTab: false },
            { label: 'JLPT July-2026', link: '/examination-and-contest/jlpt-july-2026', openInNewTab: false },
            { label: 'Japanese Language Speech Contest (JLSC)', link: '/examination-and-contest/japanese-language-speech-contest-jlsc', openInNewTab: false },
            { label: 'JLPT July-2026 Admit Card & Test Schedule', link: '/examination-and-contest/jlpt-july-2026-admit-card', openInNewTab: false },
            { label: '37th All India JLSC', link: '/examination-and-contest/37th-all-india-jlsc', openInNewTab: false },
          ],
        },
        {
          label: 'Study In Japan',
          link: '/study-in-japan',
          openInNewTab: false,
          children: [
            { label: 'Counselling Cell', link: '/study-in-japan/counselling-cell', openInNewTab: false },
            { label: 'How to Join Japanese Universities', link: '/study-in-japan/how-to-join-japanese-universities', openInNewTab: false },
            { label: 'Mitsui Scholarship Program-2026', link: '/study-in-japan/mitsui-scholarship-program-2026', openInNewTab: false },
          ],
        },
        { label: 'Publications', link: '/publications', openInNewTab: false },
        {
          label: 'Membership',
          link: '/membership',
          openInNewTab: false,
          children: [
            { label: 'Becoming a Member', link: '/membership/becoming-a-member', openInNewTab: false },
            { label: 'Members Directory', link: '/membership/members-directory', openInNewTab: false },
          ],
        },
        { label: 'Kizuna India-Japan Study Forum', link: '/kizuna-india-japan-study-forum', openInNewTab: true },
      ],
    },
  })

  payload.logger.info(`— Seeding Footer global...`)
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      organizationName: 'MOMBUSHO SCHOLARS ASSOCIATION OF INDIA',
      socialLinks: {
        facebook: 'https://facebook.com/mosai.india',
        instagram: 'https://instagram.com/mosai.india',
        linkedin: 'https://linkedin.com/company/mosai-india',
        youtube: 'https://youtube.com/@mosai-india',
      },
      contact: {
        email: 'info@mosai.org.in',
        phone: '+91-11-23000000, +91-11-23000001',
        address: 'MOSAI Office, 102 First Floor, F-Block, Connaught Place, New Delhi - 110001, India',
      },
      copyright: '© 2026 MOSAI - Mombusho Scholars Association of India. All rights reserved.',
      showVisitorCounter: true,
      showCalendar: true,
    },
  })

  payload.logger.info('MOSAI Database seeded successfully!')
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}
