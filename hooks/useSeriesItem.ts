import { api } from '@/lib/trpc'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

export function useSeriesItem() {
  const params = useParams() as { id: string }

  const id = params?.id as string
  const res = useQuery({
    queryKey: ['series', id],
    queryFn: () => api.series.getSeriesById.query(id),
    enabled: !!params.id,
  })

  return res
}
