import { addToIpfs } from '@/lib/addToIpfs'
import { redisKeys } from '@/lib/redisKeys'
import Redis from 'ioredis'
import { NextApiRequest, NextApiResponse, PageConfig } from 'next'
import NextCors from 'nextjs-cors'
import { Address } from 'viem'

const redis = new Redis(process.env.REDIS_URL!)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is allowed' })
  }

  const cid = await addToIpfs(req.body)

  const address = req.query?.address as Address
  if (address) {
    const key = redisKeys.space(address.toLowerCase())
    await redis.del(key)
    await redis.del(redisKeys.spaceLogo(address.toLowerCase()))
  }
  res.json({
    cid,
    url: `https://ipfs-gateway.spaceprotocol.xyz/ipfs/${cid.toString()}`,
  })
}
