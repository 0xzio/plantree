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
