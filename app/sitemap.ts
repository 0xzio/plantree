import { getPosts } from '@/lib/fetchers'
import { headers } from 'next/headers'

export default async function Sitemap() {
  const headersList = await headers()
  const domain = headersList.get('host')

  // const posts = await getPosts()

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `https://${domain}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `https://${domain}/themes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `https://${domain}/self-hosted`,
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
