'use client'

import LoadingDots from '@/components/icons/loading-dots'
import { Separator } from '@/components/ui/separator'
import { useSite } from '@/hooks/useSite'
import { getSiteCustomDomain } from '@/lib/getSiteDomain'
import { CustomDomainForm } from './CustomDomainForm'
import { DomainConfiguration } from './DomainConfiguration'
import { SubdomainDomainForm } from './SubdomainDomainForm'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, site, error } = useSite()

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  const customDomain = getSiteCustomDomain(site)
  return (
    <div className="space-y-8">
      <SubdomainDomainForm site={site!} />
      <Separator></Separator>
      <CustomDomainForm site={site!} />
      {customDomain && <DomainConfiguration domain={customDomain} />}
    </div>
  )
}
