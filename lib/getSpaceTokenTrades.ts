import { RESPACE_SUBGRAPH_URL } from '@/lib/constants'
import { spaceTokenTradesQuery } from '@/lib/gql'
import { Trade } from '@/lib/types'
import { request } from 'graphql-request'

interface SpaceTokenTradesQueryResponse {
  trades: Trade[]
}

export async function getSpaceTokenTrades(
  tokenAddress: string,
  startTimestamp: number,
  endTimestamp: number,
) {
  const { trades = [] }: SpaceTokenTradesQueryResponse = await request({
    url: RESPACE_SUBGRAPH_URL,
    document: spaceTokenTradesQuery,
    variables: { tokenAddress, startTimestamp, endTimestamp },
  })
  return trades
}
