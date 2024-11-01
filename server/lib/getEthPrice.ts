import { precision } from '@/lib/math'
import Redis from 'ioredis'
import { createPublicClient, http } from 'viem'
import { arbitrum } from 'viem/chains'

const redis = new Redis(process.env.REDIS_URL!)

const priceAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'priceFeedAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getChainlinkLatestPrice',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
] as const

export async function getEthPrice(): Promise<number> {
  const cacheKey = 'ETHUSDT_PRICE'
  const cacheTTL = 30 //  30s

  const publicClient = createPublicClient({
    chain: arbitrum,
    transport: http(),
  })

  const price = await publicClient.readContract({
    address: '0xC770C4855D0adEB9b7a792FCbaaE6030C5458D72',
    abi: priceAbi,
    functionName: 'getChainlinkLatestPrice',
    args: ['0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612'],
  })

  try {
    const cachedPrice = await redis.get(cacheKey)
    if (cachedPrice) return parseFloat(cachedPrice)

    const ethPrice = precision.toDecimal(price, 8)
    await redis.set(cacheKey, ethPrice.toString(), 'EX', cacheTTL)

    return ethPrice
  } catch (error) {
    console.error('Error fetching ETH price:', error)
    throw new Error('Failed to fetch ETH price')
  }
}
