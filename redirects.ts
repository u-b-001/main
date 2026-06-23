import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  const kizunaRedirect = {
    source: '/kizuna-india-japan-study-forum',
    destination: 'https://www.kizunamosai.in',
    permanent: false,
  }

  return [internetExplorerRedirect, kizunaRedirect]
}
