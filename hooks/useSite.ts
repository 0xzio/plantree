import { api } from '@/lib/trpc'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

export function useSite() {
  const { data: session } = useSession()
  const { data, ...rest } = useQuery({
    queryKey: ['site', session?.domain?.domain!],
    queryFn: async () => {
      return api.site.bySubdomain.query(session?.domain?.domain!)
    },

    enabled: !!session?.domain,
  })
  return { site: data!, ...rest }
}
