'use client'

import { usePlanListDialog } from '@/components/PlanList/usePlanListDialog'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { ROOT_DOMAIN } from '@/lib/constants'
import { getSiteDomain } from '@/lib/getSiteDomain'
import { useSession } from '@/lib/useSession'
import { PlanType } from '@prisma/client'
import { ExternalLink, LinkIcon } from 'lucide-react'

interface Props {}

export function VisitSiteButton({}: Props) {
  const site = useSiteContext()
  const { domain, isSubdomain } = getSiteDomain(site as any)
  const host = isSubdomain ? `${domain}.${ROOT_DOMAIN}` : domain

  return (
    <div className="flex-1">
      <Button
        variant="outline"
        size="lg"
        className="rounded-full font-bold w-full flex gap-1"
        onClick={async () => {
          window.open(`${location.protocol}//${host}`)
        }}
      >
        <span>Visit site</span>
        <ExternalLink size={16} />
      </Button>
    </div>
  )
}
