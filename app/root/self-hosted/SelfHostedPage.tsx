'use client'

import LoadingDots from '@/components/icons/loading-dots'
import { LoginButton } from '@/components/LoginButton'
import { Button } from '@/components/ui/button'
import { api, trpc } from '@/lib/trpc'
import { HostedSite } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { ApiTokenDialog } from './ApiTokenDialog/ApiTokenDialog'
import { useApiTokenDialog } from './ApiTokenDialog/useApiTokenDialog'
import { DeployNewSiteDialog } from './DeployNewSiteDialog/DeployNewSiteDialog'
import { useDeployNewSiteDialog } from './DeployNewSiteDialog/useDeployNewSiteDialog'
import { DeploySiteForm } from './DeploySiteForm'
import { HostedSiteItem } from './HostedSiteItem'

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
        <div className="text-base text-foreground/70">
          Deploy your own site to Cloudflare Pages in 10 minutes.
        </div>
        <div className="text-sm text-foreground/50 -mt-1">
          100% run on Cloudflare and deploy freely.
        </div>
        <LoginButton size="lg" variant="default">
          Sign in to deploy
        </LoginButton>
      </div>
    )
  }

  return (
    <>
      <ApiTokenDialog />
      <DeployNewSiteDialog />
      <Content />
    </>
  )
}

function Content() {
  const { setIsOpen } = useDeployNewSiteDialog()
  const { setIsOpen: openApiTokenDialog } = useApiTokenDialog()
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
    <div className="max-w-3xl mx-auto mt-20">
      <div className="flex items-center justify-between mb-8">
        <div className="text-3xl font-bold">My sites</div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              openApiTokenDialog(true)
            }}
          >
            Update API token
          </Button>

          <Button
            size="lg"
            onClick={() => {
              setIsOpen(true)
            }}
          >
            Deploy new site
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {data.map((site) => (
          <HostedSiteItem key={site.id} site={site} />
        ))}
      </div>
    </div>
  )
}

