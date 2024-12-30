'use client'

import { useEffect } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api, trpc } from '@/lib/trpc'
import { HostedSite } from '@prisma/client'
import { Check, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

export function HostedSiteItem({ site }: { site: HostedSite }) {
  const { isPending, mutateAsync } = trpc.hostedSite.redeploy.useMutation()
  const { refetch } = trpc.hostedSite.myHostedSites.useQuery()

  const redeploy = async () => {
    try {
      const res = await mutateAsync({ id: site.id })
      refetch()
      toast.success('Redeploy task created!')
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }
  return (
    <div
      key={site.id}
      className="border border-foreground/5 p-5 bg-background rounded-lg space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">{site.name}</div>
        <Button
          size="sm"
          variant="outline-solid"
          className="w-24"
          disabled={isPending}
          onClick={redeploy}
        >
          {isPending ? (
            <LoadingDots className="bg-foreground/60"></LoadingDots>
          ) : (
            'Redeploy'
          )}
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
    <div>
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
      <div className="flex gap-2 mt-3">
        <Badge variant="secondary">
          <Check size={16} className="text-green-500 mr-1" />
          D1
        </Badge>
        <Badge variant="secondary">
          <Check size={16} className="text-green-500 mr-1" />
          R2
        </Badge>
        <Badge variant="secondary">
          <Check size={16} className="text-green-500 mr-1" />
          KV
        </Badge>
      </div>
    </div>
  )
}
