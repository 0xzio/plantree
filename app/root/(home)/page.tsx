import { Suspense } from 'react'
import { Metadata } from 'next'
import { LaunchButton } from './LaunchButton'
import { SiteList } from './SiteList'

const appUrl = process.env.NEXT_PUBLIC_URL

const frame = {
  version: 'next',
  imageUrl: `${appUrl}/opengraph-image`,
  button: {
    title: 'Create my digital garden',
    action: {
      type: 'launch_frame',
      name: 'PenX',
      url: appUrl,
      splashImageUrl: `${appUrl}/images/logo-192.png`,
      splashBackgroundColor: '#f7f7f7',
    },
  },
}

export const dynamic = 'force-static'
export const revalidate = 3600 * 24 * 365

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'PenX',
    openGraph: {
      title: 'PenX',
      description: 'Next-generation blog tool',
    },
    other: {
      'fc:frame': JSON.stringify(frame),
    },
  }
}

export default async function HomePage() {
  return (
    <div>
      <div className="flex items-center justify-between mt-10 mb-6">
        <div className="text-2xl font-semibold">Sites</div>
        {/* <Suspense fallback={''}>
          <LaunchButton />
        </Suspense> */}
      </div>
      <SiteList />
    </div>
  )
}
