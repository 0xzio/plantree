import { NETWORK, NetworkNames } from './constants'

const developAddress = {
  SpaceFactory: '0xBB49C3C9a9d34FcaDC6Bcc7EffFC1d6592e8473a',
  TreeToken: '0x3b124F95542B8bD7B8E0F54367E4F69702FAcBC6',
}

const arbSepoliaAddress = {
  SpaceFactory: '0x7338e3E4CeD6916686cf4E82c515ECD9D244C934',
  TreeToken: '0x3b124F95542B8bD7B8E0F54367E4F69702FAcBC6',
}

const baseSepoliaAddress = {
  SpaceFactory: '0x2728B1E9cEf2d2278EB7C951a553D0E5a6aE45d0',
  TreeToken: '0x3b124F95542B8bD7B8E0F54367E4F69702FAcBC6',
}
const baseAddress = {
  SpaceFactory: '0x692C2493Dd672eA3D8515C193e4c6E0788972115',
  TreeToken: '0x3b124F95542B8bD7B8E0F54367E4F69702FAcBC6',
}

export const addressMap: Record<keyof typeof developAddress, any> =
  (function () {
    if (NETWORK === NetworkNames.ARB_SEPOLIA) {
      return arbSepoliaAddress
    }
    if (NETWORK === NetworkNames.BASE_SEPOLIA) {
      return baseSepoliaAddress
    }

    if (NETWORK === NetworkNames.BASE) {
      return baseAddress
    }
    return developAddress
  })()

export const ADDRESS_TO_CONTRACT = new Map(
  Object.entries(addressMap).map(([contract, address]) => [address, contract]),
)
