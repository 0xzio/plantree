'use client'

import { useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { isServer, ROOT_DOMAIN } from '@/lib/constants'
import { getSiteDomain, SiteWithDomains } from '@/lib/getSiteDomain'
import { Link } from '@/lib/i18n'
import { MySite } from '@/lib/types'
import { cn, getUrl } from '@/lib/utils'

interface Props {
  site: MySite
}

export function SiteItem({ site }: Props) {
  const { domain, isSubdomain } = getSiteDomain(site)
  const link = useMemo(() => {
    if (isServer) return ''
    return isSubdomain
      ? `${location.protocol}//${domain}.${ROOT_DOMAIN}`
      : `${location.protocol}//${domain}`
  }, [domain, isSubdomain])

  return (
    <Link
      key={site.id}
      href={link}
      isSite
      target="_blank"
      className={cn(
        'flex items-center justify-between p-5 gap-3 bg-background rounded-xl shadow hover:scale-105 cursor-pointer transition-all dark:bg-foreground/5',
        // spaces.length !== index + 1 && 'border-b border-neutral-100/90',
      )}
    >
      <div className="flex items-center gap-2">
        <Avatar className="w-12 h-12 rounded-lg">
          <AvatarImage src={getUrl(site.logo || '')} />
          <AvatarFallback>{site.name.slice(0, 1)}</AvatarFallback>
        </Avatar>

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
