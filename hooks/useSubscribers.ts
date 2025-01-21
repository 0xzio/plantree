import { useSiteContext } from '@/components/SiteContext'
import { trpc } from '@/lib/trpc'

export function useSubscribers() {
  const site = useSiteContext()
  return trpc.subscriber.list.useQuery(
    { siteId: site?.id },
    {
      enabled: !!site?.id,
    },
  )
}
