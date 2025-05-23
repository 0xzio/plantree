'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { LoginButton } from '@/components/LoginButton'
import { Button } from '@/components/ui/button'
import { api, trpc } from '@/lib/trpc'
import { useSession } from '@/lib/useSession'
import { Trans } from '@lingui/react/macro'
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
        <h2 className="text-4xl font-bold">
          <Trans>Deploy in 10 minutes</Trans>
        </h2>
        <div className="text-base text-foreground/70">
          <Trans>Deploy your own site to Cloudflare Pages in 10 minutes.</Trans>
        </div>
        <div className="text-sm text-foreground/50 -mt-1">
          <Trans>100% run on Cloudflare and deploy freely.</Trans>
        </div>
        <LoginButton size="lg" variant="default">
          <Trans>Sign in to deploy</Trans>
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
        <div className="space-y-1">
          <div className="text-3xl font-bold">
            <Trans>My sites</Trans>
          </div>
          <div className="text-sm">
            <Trans>Read the deployment guide</Trans>:{' '}
            <a
              className="text-brand"
              href="https://docs.plantree.xyz/en/posts/deploy-penx-with-one-click-tools"
              target="_blank"
            >
              <Trans>Deploy Plantree with One-click tools</Trans>
            </a>
            .
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              openApiTokenDialog(true)
            }}
          >
            <Trans>Update API token</Trans>
          </Button>

          <Button
            size="lg"
            onClick={() => {
              setIsOpen(true)
            }}
          >
            <Trans>Deploy new site</Trans>
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
