import { trpc } from '@/lib/trpc'
import { useSession } from '@/lib/useSession'

export function useMySites() {
  const { data } = useSession()
  return trpc.site.mySites.useQuery(undefined, {
    enabled: !!data,
  })
}
