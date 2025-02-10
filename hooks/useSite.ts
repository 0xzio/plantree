import { CURRENT_SITE } from '@/lib/constants'
import { queryClient } from '@/lib/queryClient'
import { api } from '@/lib/trpc'
import { useQuery } from '@tanstack/react-query'
import { get } from 'idb-keyval'
import { useSession } from 'next-auth/react'
import { useMySites } from './useMySites'

export function useSite() {
  const { data: sites = [] } = useMySites()
  const { data: session } = useSession()

  const {
    data,
    isLoading,
    refetch: f,
    ...rest
  } = useQuery({
    queryKey: ['current_site'],
    queryFn: async () => {
      const currentSite = await get(CURRENT_SITE)
      const site = sites.find((s) => s.id === currentSite?.id)
      return site || sites[0]
    },
    enabled: !!session && sites.length > 0,
  })

  async function refetch() {
    const res = await api.site.byId.query({ id: data!.id })
    queryClient.setQueriesData(
      {
        queryKey: ['current_site'],
      },
      res,
    )
  }

  return { site: data!, isLoading, refetch, ...rest }
}
