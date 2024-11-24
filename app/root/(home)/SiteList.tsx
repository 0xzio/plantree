'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useSites } from '@/hooks/useSites'
import { ROOT_DOMAIN } from '@/lib/constants'
import { cn, getUrl } from '@/lib/utils'
import { Site } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'

export function SiteList() {
  const { isLoading, data: sites = [] } = useSites()
  if (isLoading)
    return (
      <div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-4 mx-auto sm:w-full rounded-lg">
          {Array(9)
            .fill('')
            .map((_, i) => (
              <Skeleton
                key={i}
                className={cn(
                  'flex items-center justify-between p-5 gap-3 bg-background rounded-2xl shadow-sm hover:scale-105 cursor-pointer transition-all h-[96px]',
                )}
              ></Skeleton>
            ))}
        </div>
      </div>
    )

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-4 mx-auto sm:w-full rounded-lg">
      {sites.map((site) => (
        <SiteItem key={site.id} site={site} />
      ))}
    </div>
  )
}

function SiteItem({ site }: { site: Site }) {
  const link = site.customDomain
    ? `${location.protocol}//${site.customDomain}`
    : `${location.protocol}//${site.subdomain}.${ROOT_DOMAIN}`
  return (
    <Link
      key={site.id}
      href={link}
      target="_blank"
      className={cn(
        'flex items-center justify-between p-5 gap-3 bg-background rounded-2xl shadow-sm hover:scale-105 cursor-pointer transition-all',
        // spaces.length !== index + 1 && 'border-b border-neutral-100/90',
      )}
    >
      <div className="flex items-center gap-2">
        <Image
          src={getUrl(site.logo || '')}
          alt=""
          width={64}
          height={64}
          className="w-12 h-12 rounded-lg"
        />

        <div className="grid gap-1">
          <div className="flex items-center gap-2">
            <div className="text-xl font-semibold mr-3">{site.name}</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-foreground/60">{site.description}</div>
          </div>
        </div>
      </div>
    </Link>
  )
}
