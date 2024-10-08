import { App } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'

export function useApps() {
  const query = gql`
    {
      apps(first: 100, orderBy: "timestamp", orderDirection: "asc") {
        id
        creator
        uri
        feeReceiver
        feePercent
        timestamp
      }
    }
  `

  const { data, ...rest } = useQuery<{ apps: App[] }>({
    queryKey: ['apps'],
    async queryFn() {
      return request({
        url: process.env.NEXT_PUBLIC_SUBGRAPH_URL!,
        document: query,
      })
    },
  })

  const apps: App[] = data?.apps || []
  return { apps, ...rest }
}
