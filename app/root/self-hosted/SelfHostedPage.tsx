'use client'

import { useEffect } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { LoginButton } from '@/components/LoginButton'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { api, trpc } from '@/lib/trpc'
import { HostedSite } from '@prisma/client'
import { ExternalLink } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { DeployNewSiteDialog } from './DeployNewSiteDialog/DeployNewSiteDialog'
import { useDeployNewSiteDialog } from './DeployNewSiteDialog/useDeployNewSiteDialog'
import { DeploySiteForm } from './DeploySiteForm'

export function SelfHostedPage() {
  const { data, status } = useSession()
  if (status === 'loading') {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-3">
        <h2 className="text-4xl font-bold">Deploy in 10 minutes</h2>
        <div className="text-base text-foreground/60">
          Deploy your own site to Cloudflare Pages in 10 minutes
        </div>
        <LoginButton size="lg" variant="default">
          Sign in to deploy
        </LoginButton>
      </div>
    )
  }

  return (
    <>
      <DeployNewSiteDialog />
      <Content />
    </>
  )
}

function Content() {
  const { setIsOpen } = useDeployNewSiteDialog()
  const { isLoading, data = [] } = trpc.hostedSite.myHostedSites.useQuery()
  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  if (!data?.length) {
    return (
      <div className="mt-20 space-y-20 pb-20">
        <DeploySiteForm />
      </div>
    )
  }
  return (
    <div className="max-w-2xl mx-auto mt-20">
      <div className="flex items-center justify-between mb-8">
        <div className="text-3xl font-bold">My sites</div>
        <Button
          size="lg"
          onClick={() => {
            setIsOpen(true)
          }}
        >
          Deploy new site
        </Button>
      </div>
      <div className="space-y-4">
        {data.map((site) => (
          <SiteItem key={site.id} site={site} />
        ))}
      </div>
    </div>
  )
}

function SiteItem({ site }: { site: HostedSite }) {
  return (
    <div
      key={site.id}
      className="border border-foreground/5 p-5 bg-background rounded-lg space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">{site.name}</div>
        <Button size="sm" variant="outline-solid">
          Redeploy
        </Button>
      </div>
      <PagesProjectInfo site={site}></PagesProjectInfo>
    </div>
  )
}

function PagesProjectInfo({ site }: { site: HostedSite }) {
  const { refetch } = trpc.hostedSite.myHostedSites.useQuery()
  const { data, isLoading } = trpc.hostedSite.siteProjectInfo.useQuery(
    {
      siteId: site.id,
    },
    {
      refetchInterval: 5 * 1000,
    },
  )

  useEffect(() => {
    if (!data) return
    api.hostedSite.update
      .mutate({
        siteId: site.id,
        domain: JSON.stringify(data.domains),
      })
      .then(() => {
        // refetch()
      })
  }, [data, site, refetch])

  if (isLoading) {
    return <Skeleton className="h-6 w-64" />
  }

  if (typeof data === 'boolean' && data === false) {
    return <div>Deploying, wait for a moment~</div>
  }
  return (
    <div className="flex justify-between items-center">
      <div className="text-foreground/60">
        {data?.domains.map((domain) => (
          <div key={domain}>
            <a
              href={`https://${domain}`}
              target="_blank"
              className="flex items-center gap-1"
            >
              {domain}
              <ExternalLink size={16} />
            </a>
          </div>
        ))}
      </div>
      {/* <Badge variant="secondary">Deploying</Badge> */}
    </div>
  )
}
