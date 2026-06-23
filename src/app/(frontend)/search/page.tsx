import type { Metadata } from 'next/types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import { Search } from '@/search/Component'
import PageClient from './page.client'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const results = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 20,
    select: {
      title: true,
      slug: true,
      meta: true,
    },
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  return (
    <div className="pt-24 pb-24 min-h-screen bg-white dark:bg-slate-950">
      <PageClient />
      <div className="container mb-16">
        <div className="max-w-[48rem] mx-auto text-center">
          <h1 className="text-3xl font-bold font-serif mb-8 text-brand-navy dark:text-white uppercase tracking-wider">Search</h1>
          <div className="max-w-[36rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      <div className="container max-w-[48rem] mx-auto px-4">
        {results.docs && results.docs.length > 0 ? (
          <div className="space-y-6">
            {results.docs.map((doc, idx) => {
              const url = `/${doc.slug}`
              return (
                <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 p-5 rounded-xl shadow-xs hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold font-serif text-brand-navy dark:text-white hover:text-brand-red transition-colors">
                    <Link href={url}>
                      {doc.title}
                    </Link>
                  </h3>
                  {doc.meta?.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {doc.meta.description}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center text-slate-400 font-serif italic py-10">No results found.</div>
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Search | MOSAI`,
  }
}
