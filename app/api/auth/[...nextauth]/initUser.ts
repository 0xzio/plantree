import { editorDefaultValue } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

export async function initUserByAddress(address: string) {
  return prisma.$transaction(
    async (tx) => {
      let user = await tx.user.findUnique({
        where: { address },
        include: {
          sites: {
            select: { spaceId: true, subdomain: true },
          },
        },
      })
      if (user) return user

      let newUser = await prisma.user.create({
        data: { address },
      })

      const site = await tx.site.create({
        data: {
          name: 'My Site',
          description: 'My personal site',
          userId: newUser.id,
          subdomain: address.toLowerCase(),
          socials: {},
          config: {},
          about: JSON.stringify(editorDefaultValue),
          logo: 'https://penx.io/logo.png',
        },
      })

      await tx.contributor.create({
        data: {
          userId: newUser.id,
          siteId: site.id,
        },
      })

      await tx.channel.create({
        data: { name: 'general', siteId: site.id, type: 'TEXT' },
      })

      return {
        ...newUser,
        sites: [
          {
            spaceId: site.spaceId,
            subdomain: site.subdomain,
          },
        ],
      }
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
      let user = await tx.user.findUnique({
        where: { googleId: info.openid },
        include: {
          sites: {
            select: { spaceId: true, subdomain: true },
          },
        },
      })
      if (user) return user

      let newUser = await prisma.user.create({
        data: {
          name: info.name,
          email: info.email,
          googleId: info.openid,
          image: info.picture,
        },
      })

      const site = await tx.site.create({
        data: {
          name: 'My Site',
          description: 'My personal site',
          userId: newUser.id,
          subdomain: newUser.id.toLowerCase(),
          socials: {},
          config: {},
          about: JSON.stringify(editorDefaultValue),
          logo: 'https://penx.io/logo.png',
        },
      })

      await tx.contributor.create({
        data: {
          userId: newUser.id,
          siteId: site.id,
        },
      })

      await tx.channel.create({
        data: { name: 'general', siteId: site.id, type: 'TEXT' },
      })

      return {
        ...newUser,
        sites: [
          {
            spaceId: site.spaceId,
            subdomain: site.subdomain,
          },
        ],
      }
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
  return prisma.$transaction(
    async (tx) => {
      let user = await tx.user.findUnique({
        where: { fid: info.fid },
        include: {
          sites: {
            select: { spaceId: true, subdomain: true },
          },
        },
      })
      if (user) return user

      let newUser = await prisma.user.create({
        data: {
          fName: info.name,
          fid: info.fid,
          image: info.image,
        },
      })

      const site = await tx.site.create({
        data: {
          name: 'My Site',
          description: 'My personal site',
          userId: newUser.id,
          subdomain: newUser.id.toLowerCase(),
          socials: {},
          config: {},
          about: JSON.stringify(editorDefaultValue),
          logo: 'https://penx.io/logo.png',
        },
      })

      await tx.contributor.create({
        data: {
          userId: newUser.id,
          siteId: site.id,
        },
      })

      await tx.channel.create({
        data: { name: 'general', siteId: site.id, type: 'TEXT' },
      })

      return {
        ...newUser,
        sites: [
          {
            spaceId: site.spaceId,
            subdomain: site.subdomain,
          },
        ],
      }
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}
