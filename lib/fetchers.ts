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
      revalidate: 60 * 60 * 24 * 365,
      tags: ['spaces'],
    },
  )()
}

const spaceIdsQuery = gql`
  {
    spaces(first: 1000) {
      id
    }
  }
`

export async function getSpaceIds() {
  return await unstable_cache(
    async () => {
      try {
        const { spaces = [] } = await request<{ spaces: SpaceType[] }>({
          url: process.env.NEXT_PUBLIC_SUBGRAPH_URL!,
          document: spaceIdsQuery,
        })
        return spaces
      } catch (error) {
        return []
      }
    },
    ['space-ids'],
    {
      revalidate: 60 * 60 * 24 * 365,
      tags: ['space-ids'],
    },
  )()
}
