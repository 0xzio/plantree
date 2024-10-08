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
}

export const editorDefaultValue = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '',
        },
      ],
    },
  ],
}
