import { useSiteContext } from '@/components/SiteContext'
import { trpc } from '@/lib/trpc'
import { atom } from 'jotai'

export function usePosts() {
  const site = useSiteContext()
  return trpc.post.listSitePosts.useQuery({ siteId: site.id })
}
