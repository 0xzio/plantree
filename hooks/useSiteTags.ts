import { useSiteContext } from '@/components/SiteContext'
import { trpc } from '@/lib/trpc'

export function useSiteTags() {
  const site = useSiteContext()
  return trpc.tag.listSiteTags.useQuery(
    { siteId: site.id },
    {
      enabled: !!site?.id,
    },
  )
}
