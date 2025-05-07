import { getSite } from '@/lib/fetchers'
import type { MetadataRoute } from 'next'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  return {
    name: 'Plantree',
    short_name: 'Plantree',
    description: 'Build your own Digital Garden',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/images/logo-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/logo-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
