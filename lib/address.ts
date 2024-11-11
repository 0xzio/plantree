import { NETWORK, NetworkNames } from './constants'

const baseSepoliaAddress = {
  SpaceFactory: '0x2728B1E9cEf2d2278EB7C951a553D0E5a6aE45d0',
  PenToken: '0xd8501D1063Db721512572738e53775F11C05Df10',
}

const baseAddress = {
  SpaceFactory: '0x692C2493Dd672eA3D8515C193e4c6E0788972115',
  PenToken: '0xadA2eA2D7e2AbB724F860ED8d08F85B25a4cB90d',
}

export const addressMap: Record<keyof typeof baseAddress, any> = (function () {
  if (NETWORK === NetworkNames.BASE_SEPOLIA) {
    return baseSepoliaAddress
  }

  if (NETWORK === NetworkNames.BASE) {
    return baseAddress
  }
  return baseSepoliaAddress
})()

export const ADDRESS_TO_CONTRACT = new Map(
  Object.entries(addressMap).map(([contract, address]) => [address, contract]),
)
