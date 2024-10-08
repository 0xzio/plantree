import { spaceAbi } from '@/lib/abi'
import { IPFS_GATEWAY } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { SpaceInfo } from '@/lib/types'
import { wagmiConfig } from '@/lib/wagmi'
import { readContract } from '@wagmi/core'
import ky from 'ky'
import { NextRequest, NextResponse } from 'next/server'
import { Address } from 'viem'

// export const runtime = 'edge'

export async function POST(req: Request) {
  const json = await req.json()
  const spaceAddress: string = json.spaceAddress
  const cid: string = json.cid
  const ipns: string = json.ipns

  const config = await readContract(wagmiConfig, {
    address: spaceAddress as Address,
    abi: spaceAbi,
    functionName: 'config',
  })

  const [uri] = config

  const spaceInfo = await ky
    .get(`${IPFS_GATEWAY}/ipfs/${uri}`)
    .json<SpaceInfo>()

  const domain = spaceInfo.subdomain

  const item = await prisma.domain.findUnique({ where: { spaceAddress } })

  if (!spaceAddress) {
    return NextResponse.json({ ok: false })
  }

  if (!item) {
    await prisma.domain.create({
      data: {
        spaceAddress,
        domain,
        cid,
        ipns,
      },
    })
  } else {
    await prisma.domain.update({
      where: { spaceAddress },
      data: {
        domain,
        cid,
        ipns,
      },
    })
  }

  return NextResponse.json({
    ok: true,
  })
}

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get('domain') as string

  const item = await prisma.domain.findUniqueOrThrow({
    where: { domain },
  })

  return NextResponse.json(item)
}
