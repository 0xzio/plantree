import { gql } from 'graphql-request'

export const spacesQuery = gql`
  {
    spaces(first: 100, orderBy: "timestamp", orderDirection: "asc") {
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

export const spaceTokenTradesQuery = gql`
  query listTrades(
    $tokenAddress: String!
    $startTimestamp: Int!
    $endTimestamp: Int!
  ) {
    trades(
      first: 1000
      orderBy: "timestamp"
      orderDirection: "desc"
      where: {
        space_: { id: $tokenAddress }
        timestamp_gte: $startTimestamp
        timestamp_lte: $endTimestamp
      }
    ) {
      type
      account
      ethAmount
      tokenAmount
      timestamp
    }
  }
`
