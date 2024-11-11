export const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY!

export const SECONDS_PER_MONTH = BigInt(24 * 60 * 60 * 30) // 30 days
export const SECONDS_PER_DAY = BigInt(24 * 60 * 60) // 1 days

export enum TradeType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum SubscriptionType {
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
}

export enum TradeSource {
  MEMBER = 'MEMBER',
  SPONSOR = 'SPONSOR',
  HOLDER = 'HOLDER',
}

export enum NetworkNames {
  MAINNET = 'MAINNET',
  DEVELOP = 'DEVELOP',
  SEPOLIA = 'SEPOLIA',
  ARB_SEPOLIA = 'ARB_SEPOLIA',
  BASE_SEPOLIA = 'BASE_SEPOLIA',
  BASE = 'BASE',
}

export const NETWORK = process.env.NEXT_PUBLIC_NETWORK as NetworkNames

export const editorDefaultValue = [
  {
    type: 'p',
    children: [{ text: '' }],
  },
]

export const SUBGRAPH_URL =
  NETWORK === NetworkNames.BASE
    ? 'https://gateway.thegraph.com/api/c2921e95d896043ce3602d19cbbedcd2/subgraphs/id/CU3uKSKPmb5UP2imvySrJSHpU5DDnfpV5TdjWqbeZ85M'
    : 'https://api.studio.thegraph.com/query/88544/respace-base-sepolia/version/latest'
