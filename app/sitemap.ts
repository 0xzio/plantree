import { getPosts, getSite } from '@/lib/fetchers'
import { headers } from 'next/headers'

export default async function Sitemap(...arg: any) {
  const headersList = await headers()
  const hostname = headersList.get('host')

  const isRoot =
    hostname === 'localhost:4000' ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN

  if (isRoot) {
    return [
      {
        url: `https://${hostname}`,
        lastModified: new Date(),
        priority: 1,
      },
      {
        url: `https://${hostname}/about`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `https://${hostname}/themes`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      },
      {
        url: `https://${hostname}/self-hosted`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.4,
      },
      {
        url: 'https://docs.penx.io',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.2,
      },
    ]
  }
  const site = await getSite({ domain: hostname })
  const posts = await getPosts(site.id)

  return [
    {
      url: `https://${hostname}`,
      lastModified: new Date(),
    },
    {
      url: `https://${hostname}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
    },
    {
      url: `https://${hostname}/posts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
    },
    {
      url: `https://${hostname}/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
    },
    ...posts.map((item) => ({
      url: `https://${hostname}/posts/${item.slug}`,
      lastModified: item.publishedAt,
    })),
  ]
}
