import { Suspense } from 'react'
import { initLingui } from '@/initLingui'
import { getHomeSites, getSiteCount } from '@/lib/fetchers'
import { Trans } from '@lingui/react/macro'
import { Metadata } from 'next'
import { LaunchButton } from './LaunchButton'
import { Screenshots } from './Screenshots'
import { SiteCount } from './SiteCount'
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
export const revalidate = 86400 // 3600 * 24 * 365

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'PenX',
    openGraph: {
      title: 'PenX',
      description: 'Modern blogging tools',
    },
    other: {
      'fc:frame': JSON.stringify(frame),
    },
  }
}

export default async function HomePage(props: { params: any }) {
  const lang = (await props.params).lang
  initLingui(lang)
  const [count, sites] = await Promise.all([getSiteCount(), getHomeSites()])
  return (
    <div>
      <div className="flex justify-center mt-8">
        <SiteCount count={count} sites={sites} />
      </div>

      <div className="rounded-xl shadow-lg border border-foreground/5 w-full h-700 overflow-hidden mt-20">
        <Screenshots />
      </div>
      <div className="flex items-center justify-between mt-10 mb-6">
        <div className="text-2xl font-semibold">
          <Trans>Sites</Trans>
        </div>
        {/* <Suspense fallback={''}>
          <LaunchButton />
        </Suspense> */}
      </div>
      <SiteList sites={sites} />
    </div>
  )
}
