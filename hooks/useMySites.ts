import { trpc } from '@/lib/trpc'
import { useSession } from 'next-auth/react'

export function useMySites() {
  const { data } = useSession()
  return trpc.site.mySites.useQuery(undefined, {
    enabled: !!data,
  })
}
