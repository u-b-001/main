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

const globals: any[] = ['header', 'footer', 'homepage', 'site-settings']

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

  const mediaAboutDoc = await payload.create({
    collection: 'media',
    data: { alt: 'About MOSAI Banner', caption: 'About MOSAI' },
    file: imageHeroBuffer,
  })

  const mediaLangDoc = await payload.create({
    collection: 'media',
    data: { alt: 'Japanese Language Banner', caption: 'Japanese Language' },
    file: imageHeroBuffer,
  })

  const mediaExamDoc = await payload.create({
    collection: 'media',
    data: { alt: 'Exams & Contests Banner', caption: 'Exams & Contests' },
    file: imageHeroBuffer,
  })

  const mediaStudyDoc = await payload.create({
    collection: 'media',
    data: { alt: 'Study in Japan Banner', caption: 'Study in Japan' },
    file: imageHeroBuffer,
  })

  const mediaMembershipDoc = await payload.create({
    collection: 'media',
    data: { alt: 'Membership Banner', caption: 'Membership Portal' },
    file: imageHeroBuffer,
  })

  const mediaAvatarDoc = await payload.create({
    collection: 'media',
    data: { alt: 'Member Avatar Placeholder', caption: 'Profile Photo' },
    file: imageHeroBuffer,
  })

  payload.logger.info(`— Seeding site-settings global...`)
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'MOSAI',
      favicon: mediaDoc.id,
      homePage: 'pages:home',
      themePreset: 'mosai',
      headingFont: 'Playfair Display',
      bodyFont: 'Inter',
      themeColors: {
        primaryColor: '#4B2E83',
        secondaryColor: '#1A103D',
        accentColor: '#EAB308',
        backgroundColor: '#FFFFFF',
        surfaceColor: '#FFFFFF',
        mutedBackgroundColor: '#F8F4FF',
        textColor: '#1A103D',
      },
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
      hero: mediaAboutDoc.id,
      layoutStyle: 'sidebar',
      heroStyle: 'medium',
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
      hero: mediaLangDoc.id,
      layoutStyle: 'sidebar',
      heroStyle: 'medium',
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

    // Assign category-specific hero image to avoid sharing a single media record
    let heroImageId = mediaDoc.id
    if (slug.startsWith('about-mosai')) {
      heroImageId = mediaAboutDoc.id
    } else if (slug.startsWith('japanese-language')) {
      heroImageId = mediaLangDoc.id
    } else if (slug.startsWith('examination-and-contest')) {
      heroImageId = mediaExamDoc.id
    } else if (slug.startsWith('study-in-japan')) {
      heroImageId = mediaStudyDoc.id
    } else if (slug.startsWith('membership')) {
      heroImageId = mediaMembershipDoc.id
    }

    await payload.create({
      collection: 'pages',
      data: {
        title,
        slug,
        hero: heroImageId,
        layoutStyle: 'sidebar',
        heroStyle: 'medium',
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

  payload.logger.info(`— Seeding Home page in pages collection...`)
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Home',
      slug: 'home',
      hero: mediaDoc.id,
      layoutStyle: 'fullWidth',
      heroStyle: 'medium',
      layout: [
        {
          blockType: 'hero',
          mode: 'single',
          layout: 'split',
          singleSlide: {
            mediaType: 'image',
            image: mediaDoc.id,
            heading: 'Mombusho Scholars Association of India',
            subtitle: 'Promoting academic and cultural exchange between India and Japan.',
            buttons: [
              {
                label: 'Explore Courses',
                url: '/japanese-language/about-institute',
                variant: 'primary',
              },
              {
                label: 'Learn More',
                url: '/about-mosai/the-association',
                variant: 'secondary',
              }
            ]
          }
        },
        {
          blockType: 'flexibleRow',
          containerWidth: 'boxed',
          rowBackground: 'transparent',
          rowPadding: 'none',
          gridGap: 'medium',
          alignItems: 'stretch',
          columns: [
            {
              width: '50',
              columnStyle: 'simple',
              backgroundColor: 'transparent',
              textColor: 'dark',
              columnPadding: 'none',
              alignment: 'left',
              title: 'Who We Are',
              imageShape: 'rounded',
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
            } as any,
            {
              width: '50',
              columnStyle: 'simple',
              backgroundColor: 'transparent',
              textColor: 'dark',
              columnPadding: 'none',
              alignment: 'left',
              title: 'Our Purpose',
              imageShape: 'rounded',
              content: {
                root: {
                  children: [
                    {
                      children: [{ detail: 0, format: 0, mode: 'normal', text: 'We act as the nodal network for academic, cultural, and professional collaborations, providing university counseling and scholarship guidance for students aiming to study in Japan.', type: 'text', version: 1 }],
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
            } as any
          ]
        } as any,
        {
          blockType: 'featuredCards',
          heading: 'Key Offerings',
          subheading: 'Explore our services and resources.',
          columns: '3',
          cardStyle: 'standard',
          cards: [
            {
              title: 'Language Institute',
              description: 'Learn Japanese from beginner to advanced levels.',
              icon: 'academic',
              buttonLabel: 'Learn More',
              buttonUrl: '/japanese-language'
            },
            {
              title: 'Study in Japan',
              description: 'Complete counselling and application support for MEXT.',
              icon: 'globe',
              buttonLabel: 'Learn More',
              buttonUrl: '/study-in-japan'
            },
            {
              title: 'Events & Speech Contests',
              description: 'Participate in Japanese language speech contests and events.',
              icon: 'calendar',
              buttonLabel: 'Learn More',
              buttonUrl: '/news'
            }
          ]
        },
        {
          blockType: 'newsAndUpdates',
          heading: 'News & Notifications',
          description: 'Stay updated with the latest notices from MOSAI.',
          layout: 'spotlight',
          newsSource: 'fetch',
          limit: 5,
          viewAllEnabled: true,
          viewAllLabel: 'All News',
          viewAllUrl: '/news'
        },
        {
          blockType: 'hero',
          mode: 'single',
          layout: 'split',
          singleSlide: {
            mediaType: 'image',
            image: mediaDoc.id,
            heading: 'Japanese Speech Contests',
            subtitle: 'Join the annual All India speech contest and showcase your skills.',
          }
        },
        {
          blockType: 'cta',
          heading: 'Ready to study in Japan or learn Japanese?',
          description: 'Contact our central IT desk or admissions team to get started.',
          layout: 'gradient',
          buttons: [
            {
              label: 'Contact Us',
              url: '/help-and-support',
              variant: 'primary'
            }
          ],
          bgType: 'color',
          backgroundColor: '#1E40AF'
        }
      ]
    }
  })

  payload.logger.info(`— Seeding Header global (Section 4.1 tree structure)...`)
  await payload.updateGlobal({
    slug: 'header',
    data: {
      logo: mediaDoc.id,
      sticky: true,
      overlapHomepageHero: false,
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
