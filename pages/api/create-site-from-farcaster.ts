import { spaceFactoryAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { editorDefaultValue } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { CollaboratorRole, SubdomainType } from '@prisma/client'
import { slug } from 'github-slugger'
import { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base, baseSepolia } from 'viem/chains'

export type FarcasterUser = {
  custody_address: string
  display_name: string
  fid: number
  follower_count: number
  following_count: number
  object: 'user'
  pfp_url: string
  power_badge: boolean
  profile: {
    bio: {
      text: string
    }
  }
  username: string
  verifications: string[]
  verified_accounts: any
  verified_addresses: {
    eth_addresses: string[]
    sol_addresses: string[]
  }
}
const isBase = process.env.NETWORK === 'BASE'

const account = privateKeyToAccount(process.env.FARCASTER_PRIVATE_SECRET as any)
const walletClient = createWalletClient({
  account,
  chain: isBase ? base : baseSepolia,
  transport: http(),
})

const publicClient = createPublicClient({
  chain: isBase ? base : baseSepolia,
  transport: http(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  })
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is allowed' })
  }
  const { user, secret } = req.body as { user: FarcasterUser; secret: string }

  if (secret !== process.env.FARCASTER_CREATE_SITE_SECRET) {
    return res.status(401).json({
      code: 'INVALID_SECRET',
      message: 'Invalid secret',
    })
  }

  if (!user?.fid) {
    return res.status(401).json({
      code: 'INVALID_PARAMS',
      message: 'Invalid user params',
    })
  }

  const { site } = await initUserByFarcasterUser(user)

  const spaceFactoryAddr = isBase
    ? '0x692C2493Dd672eA3D8515C193e4c6E0788972115'
    : '0x2728B1E9cEf2d2278EB7C951a553D0E5a6aE45d0'
  const address = user.verifications[0] as any

  const price = await publicClient.readContract({
    address: addressMap.SpaceFactory,
    abi: spaceFactoryAbi,
    functionName: 'price',
  })

  const { cid } = await fetch('https://penx.io/api/ipfs-add', {
    method: 'POST',
    body: JSON.stringify({
      name: user.display_name,
      logo: user.pfp_url,
      description: user?.profile?.bio?.text || '',
    }),
    headers: { 'Content-Type': 'application/json' },
  }).then((d) => d.json())

  const hash = await walletClient.writeContract({
    address: spaceFactoryAddr,
    abi: spaceFactoryAbi,
    functionName: 'createSpace',
    args: [
      {
        appId: BigInt(1),
        spaceName: user.display_name,
        symbol: user.username.toUpperCase(),
        uri: cid,
        preBuyEthAmount: BigInt(0),
        referral: '0x0000000000000000000000000000000000000000',
      },
    ],
    value: price,
  })

  await publicClient.waitForTransactionReceipt({ hash })

  console.log('deploy successful....')

  const spaceAddresses = await publicClient.readContract({
    address: spaceFactoryAddr,
    abi: spaceFactoryAbi,
    functionName: 'getUserSpaces',
    args: [address],
  })

  console.log('======spaceAddresses:', spaceAddresses)

  await prisma.site.update({
    where: { id: site.id },
    data: {
      spaceId: spaceAddresses[spaceAddresses.length - 1],
    },
  })

  res.json({ ok: true, site })
}

// TODO:
async function initUserByFarcasterUser(info: FarcasterUser) {
  return prisma.$transaction(
    async (tx) => {
      let user = await tx.account.findUnique({
        where: { providerAccountId: info.fid.toString() },
      })

      if (user) {
        throw new Error('SITE_IS_CREATED')
      }

      const address = info.verified_addresses.eth_addresses[0] || ''

      if (!address) {
        throw new Error('VERIFIED_ADDRESS_NOT_FOUND')
      }

      let newUser = await tx.user.create({
        data: {
          name: info.username,
          displayName: info.display_name,
          // address,
          // fid: info.fid.toString(),
          image: info.pfp_url,
          bio: info.profile?.bio?.text || '',
          // farcaster: {
          //   name: info.username,
          //   displayName: info.display_name,
          //   image: info.pfp_url,
          // },
        },
      })

      const domain = slug(info.username.replace('.eth', ''))

      const site = await tx.site.create({
        data: {
          name: info.display_name,
          description: info.profile?.bio?.text || '',
          userId: newUser.id,
          socials: {},
          config: {},
          about: JSON.stringify(editorDefaultValue),
          logo: info.pfp_url,
          themeName: 'garden',
          domains: {
            create: [
              {
                domain,
                subdomainType: SubdomainType.FarcasterName,
              },
              {
                domain: address.toLowerCase(),
                subdomainType: SubdomainType.Address,
              },
            ],
          },
          collaborators: {
            create: {
              userId: newUser.id,
              role: CollaboratorRole.OWNER,
            },
          },
          channels: {
            create: {
              name: 'general',
              type: 'TEXT',
            },
          },
        },
      })

      return {
        site,
        domain,
      }
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}
