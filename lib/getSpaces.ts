import { request } from 'graphql-request'
import { spacesQuery } from './gql'
import { SpaceType } from './types'

export async function getSpaces() {
  const { spaces = [] } = await request<{ spaces: SpaceType[] }>({
    url: process.env.NEXT_PUBLIC_SUBGRAPH_URL!,
    document: spacesQuery,
  })
  return spaces
}
