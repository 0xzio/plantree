import { trpc } from '@/lib/trpc'
import { useSite } from './useSite'

export function useCollaborators() {
  const { site } = useSite()
  return trpc.collaborator.listSiteCollaborators.useQuery({ siteId: site.id })
}
