import { defaultNavLinks, editorDefaultValue } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { AccountWithUser } from '@/lib/types'
import { hashPassword } from '@/server/lib/hashPassword'
import {
  CollaboratorRole,
  PostStatus,
  PostType,
  ProviderType,
  SubdomainType,
  User,
} from '@prisma/client'
import ky from 'ky'
import { cacheHelper } from './cache-header'

const SEVEN_DAYS = 60 * 60 * 24 * 7

const includeAccount = {
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
} as const

const getSiteInfo = (newUser: User) => {
  const siteInfo = {
    userId: newUser.id,
    socials: {},
    themeName: 'sue',
    themeConfig: {},
    navLinks: defaultNavLinks,
    about: JSON.stringify(editorDefaultValue),
    config: {
      locales: ['en', 'zh-CN', 'ja'],
      features: {
        journal: false,
        gallery: false,
        page: true,
        database: false,
      },
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
  } as const
  return siteInfo
}

export async function initUserByAddress(address: string) {
  return prisma.$transaction(
    async (tx) => {
      const account = await tx.account.findUnique({
        where: { providerAccountId: address },
        ...includeAccount,
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
          logo: 'https://plantree.xyz/logo.png',
          domains: {
            create: [
              {
                domain: address.toLowerCase(),
                subdomainType: SubdomainType.Address,
              },
            ],
          },
          ...getSiteInfo(newUser),
        },
      })

      await cacheHelper.updateCachedHomeSites(null)

      const post = await tx.post.findUnique({
        where: { id: process.env.WELCOME_POST_ID },
      })

      if (post) {
        await tx.post.create({
          data: {
            userId: newUser.id,
            siteId: site.id,
            type: PostType.ARTICLE,
            title: post.title,
            content: post.content,
            status: PostStatus.PUBLISHED,
          },
        })
      }

      return tx.account.findUniqueOrThrow({
        where: { providerAccountId: address },
        ...includeAccount,
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

export async function initUserByGoogleInfo(info: GoogleLoginInfo, ref: string) {
  return prisma.$transaction(
    async (tx) => {
      const account = await tx.account.findUnique({
        where: { providerAccountId: info.openid },
        ...includeAccount,
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
                email: info.email,
              },
            ],
          },
        },
      })

      if (ref) {
        const inviter = await tx.user.findUnique({
          where: { referralCode: ref },
        })
        if (inviter) {
          await tx.referral.create({
            data: {
              inviterId: inviter.id,
              userId: newUser.id,
            },
          })
        }
      }

      const site = await tx.site.create({
        data: {
          name: info.name,
          description: 'My personal site',
          logo: info.picture,
          domains: {
            create: [
              {
                domain: newUser.id.toLowerCase(),
                subdomainType: SubdomainType.UserId,
              },
            ],
          },
          ...getSiteInfo(newUser),
        },
      })

      await cacheHelper.updateCachedHomeSites(null)

      const post = await tx.post.findUnique({
        where: { id: process.env.WELCOME_POST_ID },
      })

      if (post) {
        await tx.post.create({
          data: {
            userId: newUser.id,
            siteId: site.id,
            type: PostType.ARTICLE,
            title: post.title,
            content: post.content,
            status: PostStatus.PUBLISHED,
          },
        })
      }

      return tx.account.findUniqueOrThrow({
        where: { providerAccountId: info.openid },
        ...includeAccount,
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
        ...includeAccount,
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
          logo: newUser.image,
          domains: {
            create: [
              {
                domain: fcUser.username.replace('.eth', ''),
                subdomainType: SubdomainType.FarcasterName,
              },
            ],
          },
          ...getSiteInfo(newUser),
        },
      })

      await cacheHelper.updateCachedHomeSites(null)

      const post = await tx.post.findUnique({
        where: { id: process.env.WELCOME_POST_ID },
      })

      if (post) {
        await tx.post.create({
          data: {
            userId: newUser.id,
            siteId: site.id,
            type: PostType.ARTICLE,
            title: post.title,
            content: post.content,
            status: PostStatus.PUBLISHED,
          },
        })
      }

      return tx.account.findUniqueOrThrow({
        where: { providerAccountId: fid },
        ...includeAccount,
      })
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}

export async function initUserByEmail(
  email: string,
  password: string,
  ref: string,
) {
  return prisma.$transaction(
    async (tx) => {
      const account = await tx.account.findUnique({
        where: { providerAccountId: email },
        ...includeAccount,
      })

      if (account) return account

      const [name] = email.split('@')

      let newUser = await tx.user.create({
        data: {
          name: name,
          displayName: name,
          accounts: {
            create: [
              {
                providerType: ProviderType.EMAIL,
                providerAccountId: email,
                email: email,
                accessToken: await hashPassword(password),
              },
            ],
          },
        },
      })

      if (ref) {
        const inviter = await tx.user.findUnique({
          where: { referralCode: ref },
        })
        if (inviter) {
          await tx.referral.create({
            data: {
              inviterId: inviter.id,
              userId: newUser.id,
            },
          })
        }
      }

      const site = await tx.site.create({
        data: {
          name: name,
          description: 'My personal site',
          logo: 'https://plantree.xyz/logo.png',
          domains: {
            create: [
              {
                domain: newUser.id,
                subdomainType: SubdomainType.UserId,
              },
            ],
          },
          ...getSiteInfo(newUser),
        },
      })

      await cacheHelper.updateCachedHomeSites(null)

      const post = await tx.post.findUnique({
        where: { id: process.env.WELCOME_POST_ID },
      })

      if (post) {
        await tx.post.create({
          data: {
            userId: newUser.id,
            siteId: site.id,
            type: PostType.ARTICLE,
            title: post.title,
            content: post.content,
            status: PostStatus.PUBLISHED,
          },
        })
      }

      return tx.account.findUniqueOrThrow({
        where: { providerAccountId: email },
        ...includeAccount,
      })
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}
