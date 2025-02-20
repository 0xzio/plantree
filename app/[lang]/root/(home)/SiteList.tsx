'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useHomeSites } from '@/hooks/useHomeSites'
import { ROOT_DOMAIN } from '@/lib/constants'
import { getSiteDomain, SiteWithDomains } from '@/lib/getSiteDomain'
import { Link } from '@/lib/i18n'
import { cn, getUrl } from '@/lib/utils'

export function SiteList() {
  const { isLoading, data } = useHomeSites()

  if (isLoading || !data)
    return (
      <div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-4 mx-auto sm:w-full rounded-lg">
          {Array(9)
            .fill('')
            .map((_, i) => (
              <Skeleton
                key={i}
                className={cn(
                  'flex items-center justify-between p-5 gap-3 bg-background rounded-2xl shadow-sm hover:scale-105 cursor-pointer transition-all h-[96px] dark:bg-foreground/5',
                )}
              ></Skeleton>
            ))}
        </div>
      </div>
    )

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-4 mx-auto sm:w-full rounded-lg">
      {data.map((site) => (
        <SiteItem key={site.id} site={site} />
      ))}
    </div>
  )
}

function SiteItem({ site }: { site: SiteWithDomains }) {
  const { domain, isSubdomain } = getSiteDomain(site)
  const link = isSubdomain
    ? `${location.protocol}//${domain}.${ROOT_DOMAIN}`
    : `${location.protocol}//${domain}`

  return (
    <Link
      key={site.id}
      href={link}
      isSite
      target="_blank"
      className={cn(
        'flex items-center justify-between p-5 gap-3 bg-background rounded-2xl shadow-sm hover:scale-105 cursor-pointer transition-all dark:bg-foreground/5',
        // spaces.length !== index + 1 && 'border-b border-neutral-100/90',
      )}
    >
      <div className="flex items-center gap-2">
        <img
          src={getUrl(site.logo || '')}
          alt=""
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
