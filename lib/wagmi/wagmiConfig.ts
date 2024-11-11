import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { publicActions } from 'viem'
import { base, baseSepolia } from 'wagmi/chains'
import { NETWORK, NetworkNames } from '../constants'

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID as string

export function getChain() {
  if (NETWORK === NetworkNames.BASE_SEPOLIA) {
    return baseSepolia
  }
  return base
}

export const wagmiConfig = getDefaultConfig({
  appName: 'PenX',
  projectId: PROJECT_ID,
  chains: [getChain()],
  ssr: true,
})

export const publicClient = wagmiConfig.getClient().extend(publicActions)
