import { addToIpfs } from '@/lib/addToIpfs'
import { redisKeys } from '@/lib/redisKeys'
import Redis from 'ioredis'
import { NextApiRequest, NextApiResponse, PageConfig } from 'next'
import { Address } from 'viem'

const redis = new Redis(process.env.REDIS_URL!)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is allowed' })
  }

  const cid = await addToIpfs(req.body.content)

  const address = req.body?.address?.toLowerCase() as Address
  if (address) {
    const key = redisKeys.space(address)
    await redis.del(key)
    await redis.del(redisKeys.spaceLogo(address))
  }
  res.json({ cid })
}
