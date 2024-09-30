import { NetworkNames } from './constants'

const NETWORK = process.env.NEXT_PUBLIC_NETWORK as NetworkNames

const developAddress = {
  USDC: '0x87174b7C93dB67ab6307951e3A71e70C720D9700',

  SpaceFactory: '0x5d5bf147e2C4824C6A488821475A63F3aaD71183',
}

const arbSepoliaAddress = {
  USDC: '0x87174b7C93dB67ab6307951e3A71e70C720D9700',

  SpaceFactory: '0x5d5bf147e2C4824C6A488821475A63F3aaD71183',
}

const baseSepoliaAddress = {
  USDC: '0x87174b7C93dB67ab6307951e3A71e70C720D9700',

  SpaceFactory: '0x5026a0b7b8de5900EdAE9bb5D51D878e732D9AeB',
}

export const addressMap: Record<keyof typeof developAddress, any> =
  (function () {
    if (NETWORK === NetworkNames.ARB_SEPOLIA) {
      return arbSepoliaAddress
    }
    if (NETWORK === NetworkNames.BASE_SEPOLIA) {
      return baseSepoliaAddress
    }
    return developAddress
  })()

export const ADDRESS_TO_CONTRACT = new Map(
  Object.entries(addressMap).map(([contract, address]) => [address, contract]),
)
