import { spaceFactoryAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { NETWORK, NetworkNames } from '@/lib/constants'
import { NextResponse } from 'next/server'
import { Address, createPublicClient, http } from 'viem'
import { base, baseSepolia, mainnet, optimism } from 'viem/chains'

export const runtime = 'edge'

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export async function GET(req: Request) {
  const url = new URL(req.url)
  const address = url.searchParams.get('address') as Address
  const network = url.searchParams.get('network') || NETWORK

  if (!address) throw new Error('Invalid address')

  const baseClient = createPublicClient({
    chain: network === NetworkNames.BASE ? base : baseSepolia,
    transport: http(),
  })

  const t0 = Date.now()

  let cap = 50

  const spaces = await baseClient.readContract({
    address: addressMap.SpaceFactory,
    abi: spaceFactoryAbi,
    functionName: 'getUserSpaces',
    args: [address],
  })

  if (spaces.length) {
    cap = 1000
  } else {
    const ensName = await mainnetClient.getEnsName({ address })
    if (ensName) cap = 500
  }

  const t1 = Date.now()

  return NextResponse.json(
    {
      t: t1 - t0,
      cap,
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    },
  )
}
