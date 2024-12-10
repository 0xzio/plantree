import { trpc } from '@/lib/trpc'

export function useMySites() {
  return trpc.site.mySites.useQuery()
}
