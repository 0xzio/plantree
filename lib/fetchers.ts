import { gql, request } from 'graphql-request'
import { unstable_cache } from 'next/cache'
import { SpaceOnEvent, SpaceType } from './types'

const spacesQuery = gql`
  {
    spaces(first: 100) {
      id
      spaceId
      address
      founder
      symbol
      name
      preBuyEthAmount
      ethVolume
      tokenVolume
      tradeCreatorFee
      uri
      memberCount
      members {
        id
        account
      }
    }
  }
`

export async function getHomeSpaces() {
  return await unstable_cache(
    async () => {
      try {
        const { spaces = [] } = await request<{ spaces: SpaceType[] }>({
          url: process.env.NEXT_PUBLIC_SUBGRAPH_URL!,
          document: spacesQuery,
        })
        return spaces
      } catch (error) {
        return []
      }
    },
    ['spaces'],
    {
      revalidate: 10,
      tags: ['spaces'],
    },
  )()
}
