import { editorDefaultValue } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { AccountWithUser } from '@/lib/types'
import {
  PostStatus,
  PostType,
  ProviderType,
  SubdomainType,
} from '@prisma/client'
import ky from 'ky'

export function getAddress(account: AccountWithUser) {
  if (account.providerType !== ProviderType.WALLET) return ''
  return account.providerAccountId || ''
}

async function initPost(userId: string, siteId: string) {
  const post = await prisma.post.findUnique({
    where: { id: process.env.WELCOME_POST_ID },
  })

  if (post) {
    await prisma.post.create({
      data: {
        userId,
        siteId,
        type: PostType.ARTICLE,
        title: post.title,
        content: post.content,
        postStatus: PostStatus.PUBLISHED,
      },
    })
  }
}

export async function initUserByAddress(address: string) {
  return prisma.$transaction(
    async (tx) => {
      const account = await tx.account.findUnique({
        where: { providerAccountId: address },
        include: {
          user: {
            include: {
              sites: {
                include: {
                  domains: true,
                },
              },
            },
          },
        },
      })

      if (account) return account

      let newUser = await tx.user.create({
        data: {
          name: address,
          displayName: address,
          accounts: {
            create: [
              {
                providerType: ProviderType.WALLET,
                providerAccountId: address,
              },
            ],
          },
        },
      })

      const site = await tx.site.create({
        data: {
          name: address.slice(0, 6),
          description: 'My personal site',
          userId: newUser.id,
          socials: {},
          config: {},
          about: JSON.stringify(editorDefaultValue),
          logo: 'https://penx.io/logo.png',
          themeName: 'garden',
          domains: {
            create: [
              {
                domain: address.toLowerCase(),
                subdomainType: SubdomainType.Address,
              },
            ],
          },
          contributors: {
            create: {
              userId: newUser.id,
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

      await initPost(newUser.id, site.id)

      return tx.account.findUniqueOrThrow({
        where: { providerAccountId: address },
        include: {
          user: {
            include: {
              sites: {
                include: {
                  domains: true,
                },
              },
            },
          },
        },
      })
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}

type GoogleLoginInfo = {
  email: string
  openid: string
  picture: string
  name: string
}

export async function initUserByGoogleInfo(info: GoogleLoginInfo) {
  return prisma.$transaction(
    async (tx) => {
      const account = await tx.account.findUnique({
        where: { providerAccountId: info.openid },
        include: {
          user: {
            include: {
              sites: {
                include: {
                  domains: true,
                },
              },
            },
          },
        },
      })

      if (account) return account

      let newUser = await tx.user.create({
        data: {
          name: info.name,
          displayName: info.name,
          email: info.email,
          image: info.picture,
          accounts: {
            create: [
              {
                providerType: ProviderType.GOOGLE,
                providerAccountId: info.openid,
                providerInfo: info,
              },
            ],
          },
        },
      })

      const site = await tx.site.create({
        data: {
          name: info.name,
          description: 'My personal site',
          userId: newUser.id,
          socials: {},
          config: {},
          about: JSON.stringify(editorDefaultValue),
          logo: info.picture,
          themeName: 'garden',
          domains: {
            create: [
              {
                domain: newUser.id.toLowerCase(),
                subdomainType: SubdomainType.UserId,
              },
            ],
          },
          contributors: {
            create: {
              userId: newUser.id,
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

      await initPost(newUser.id, site.id)

      return tx.account.findUniqueOrThrow({
        where: { providerAccountId: info.openid },
        include: {
          user: {
            include: {
              sites: {
                include: {
                  domains: true,
                },
              },
            },
          },
        },
      })
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}

type FarcasterLoginInfo = {
  fid: string
  image: string
  name: string
}

export async function initUserByFarcasterInfo(info: FarcasterLoginInfo) {
  return initUserByFarcasterId(info.fid)
}

type FarcasterFrameInfo = {
  fid: string
  username: string
  displayName: string
  pfpUrl: string
}

type UserData = {
  user: FarcasterUser
}

type FarcasterUser = {
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

export async function initUserByFarcasterFrame(info: FarcasterFrameInfo) {
  return initUserByFarcasterId(info.fid)
}

export async function initUserByFarcasterId(fid: string) {
  return prisma.$transaction(
    async (tx) => {
      const account = await tx.account.findUnique({
        where: { providerAccountId: fid },
        include: {
          user: {
            include: {
              sites: {
                include: {
                  domains: true,
                },
              },
            },
          },
        },
      })

      if (account) return account

      const url = `https://api.pinata.cloud/v3/farcaster/users/${fid}`
      const { user: fcUser } = await ky
        .get(url, {
          headers: { Authorization: `Bearer ${process.env.PINATA_JWT}` },
        })
        .json<UserData>()

      let newUser = await tx.user.create({
        data: {
          name: fcUser.username,
          displayName: fcUser.display_name,
          bio: fcUser.profile.bio.text,
          image: fcUser.pfp_url,
          accounts: {
            create: [
              {
                providerType: ProviderType.FARCASTER,
                providerAccountId: fid,
                providerInfo: fcUser,
              },
            ],
          },
        },
      })

      for (const addr of fcUser.verified_addresses?.eth_addresses || []) {
        try {
          await tx.account.create({
            data: {
              userId: newUser.id,
              providerType: ProviderType.WALLET,
              providerAccountId: addr,
            },
          })
        } catch (error) {}
      }

      const site = await tx.site.create({
        data: {
          name: newUser.displayName!,
          description: fcUser.profile.bio.text,
          userId: newUser.id,
          socials: {},
          config: {},
          about: JSON.stringify(editorDefaultValue),
          logo: newUser.image,
          themeName: 'garden',
          domains: {
            create: [
              {
                domain: fcUser.username.replace('.eth', ''),
                subdomainType: SubdomainType.FarcasterName,
              },
            ],
          },
          contributors: {
            create: {
              userId: newUser.id,
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

      await initPost(newUser.id, site.id)

      return tx.user.findUnique({
        where: { id: newUser.id },
        include: {
          sites: {
            include: {
              domains: true,
            },
          },
        },
      })
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}
