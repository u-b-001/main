import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { News } from './collections/News'
import { Gallery } from './collections/Gallery'
import { Events } from './collections/Events'
import { Services } from './collections/Services'
import { Committee } from './collections/Committee'
import { Users } from './collections/Users'

import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { Homepage } from './globals/Homepage'
import { SiteSettings } from './globals/SiteSettings'

import { plugins } from './plugins'
import {formBuilderPlugin} from '@payloadcms/plugin-form-builder'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { Members } from './collections/Members'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  collections: [Pages, Media, Users, News, Gallery, Events, Services, Committee, Members],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, Homepage, SiteSettings],
  plugins ,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

})
