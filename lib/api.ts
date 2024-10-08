import { gql, request } from 'graphql-request'
import { SpaceOnEvent } from './types'

const spaceQuery = gql`
  query space($id: String!) {
    space(id: $id) {
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
      members {
        id
      }
    }
  }
`

export async function getSpace(address: string) {
  const maxRetries = 100 // Maximum number of retries
  let attempts = 0

  while (attempts < maxRetries) {
    try {
      const res = await request<{ space: SpaceOnEvent }>({
        url: process.env.NEXT_PUBLIC_SUBGRAPH_URL!,
        document: spaceQuery,
        variables: {
          id: address.toLowerCase(),
        },
      })

      // Check if the response contains the expected data
      if (res.space) {
        return res.space // Return the space if data is found
      }
    } catch (error) {
      console.error(`Attempt ${attempts + 1} failed:`, error)
    }

    attempts++
    await new Promise((resolve) => setTimeout(resolve, 400)) // Wait for 400 ms before retrying
  }

  throw new Error('Failed to retrieve data after multiple attempts') // Throw an error if all attempts fail
}
