import { useSiteContext } from '@/components/SiteContext'
import { trpc } from '@/lib/trpc'

export function useSiteCollaborators() {
  const site = useSiteContext()
  return trpc.collaborator.listSiteCollaborators.useQuery(
    { siteId: site.id },
    {
      enabled: !!site?.id,
    },
  )
}
