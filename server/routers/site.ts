import { cacheHelper } from '@/lib/cache-header'
import { addDomainToVercel } from '@/lib/domains'
import { prisma } from '@/lib/prisma'
import { revalidateSite } from '@/lib/revalidateSite'
import { MySite } from '@/lib/types'
import { AuthType, SubdomainType } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { reservedDomains } from '../lib/constants'
import { syncSiteToHub } from '../lib/syncSiteToHub'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const siteRouter = router({
  list: publicProcedure.query(async () => {
    return prisma.site.findMany({
      include: {
        domains: true,
        channels: true,
      },
      orderBy: { createdAt: 'asc' },
      take: 20,
    })
  }),

  listWithPagination: publicProcedure
    .input(
      z.object({
        pageNum: z.number().optional().default(1),
        pageSize: z.number().optional().default(100),
      }),
    )
    .query(async ({ input }) => {
      const { pageNum, pageSize } = input
      const offset = (pageNum - 1) * pageSize
      const list = await prisma.site.findMany({
        where: {
          postCount: { gte: 2 },
        },
        include: {
          domains: true,
          channels: true,
        },
        orderBy: { createdAt: 'asc' },
        take: pageSize,
        skip: offset,
      })

      return {
        sites: list,
        count: await prisma.site.count({
          where: {
            postCount: { gte: 2 },
          },
        }),
      }
    }),

  homeSites: publicProcedure.query(async ({ input }) => {
    const cachedSites = await cacheHelper.getCachedHomeSites()
    if (cachedSites) return cachedSites
    const sites = await prisma.site.findMany({
      where: {
        postCount: { gte: 2 },
      },
      include: {
        domains: true,
        channels: true,
      },
      orderBy: { createdAt: 'asc' },
      take: 36,
    })

    await cacheHelper.updateCachedHomeSites(sites)
    return sites
  }),

  mySites: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.token.uid

    const cachedMySites = await cacheHelper.getCachedMySites(userId)
    if (cachedMySites) return cachedMySites

    const collaborators = await prisma.collaborator.findMany({
      where: { userId },
    })

    const sites = await prisma.site.findMany({
      where: {
        id: {
          in: [...collaborators.map((c) => c.siteId)],
        },
      },
      include: { domains: true, channels: true },
    })

    await cacheHelper.updateCachedMySites(userId, sites)
    return sites as MySite[]
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return prisma.site.findUniqueOrThrow({
        where: { id: input.id },
        include: { domains: true },
      })
    }),

  listSiteSubdomains: protectedProcedure
    .input(z.object({ siteId: z.string() }))
    .query(async ({ ctx, input }) => {
      return prisma.domain.findMany({
        where: { siteId: input.siteId, isSubdomain: true },
      })
    }),

  mySite: protectedProcedure.query(async ({ input, ctx }) => {
    const site = await prisma.site.findFirstOrThrow({
      where: { userId: ctx.token.uid },
      include: { domains: true },
    })
    return site
  }),

  bySubdomain: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const { siteId } = await prisma.domain.findUniqueOrThrow({
        where: { domain: input },
        select: { siteId: true },
      })
      const site = await prisma.site.findUnique({
        where: { id: siteId },
        include: { domains: true },
      })

      if (site) return site

      const user = await prisma.user.findUniqueOrThrow({
        where: { id: ctx.token.uid },
        include: {
          sites: { select: { id: true } },
        },
      })

      return prisma.site.findUniqueOrThrow({
        where: { id: user.sites[0]?.id },
        include: { domains: true },
      })
    }),

  updateSite: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        logo: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        about: z.string().optional(),
        themeName: z.string().optional(),
        spaceId: z.string().optional(),
        navLinks: z
          .array(
            z.object({
              title: z.string().optional(),
              pathname: z.string().optional(),
              type: z.string().optional(),
              visible: z.boolean().optional(),
            }),
          )
          .optional(),
        socials: z
          .object({
            farcaster: z.string().optional(),
            x: z.string().optional(),
            mastodon: z.string().optional(),
            github: z.string().optional(),
            facebook: z.string().optional(),
            youtube: z.string().optional(),
            linkedin: z.string().optional(),
            threads: z.string().optional(),
            instagram: z.string().optional(),
            discord: z.string().optional(),
            medium: z.string().optional(),
          })
          .optional(),
        analytics: z
          .object({
            gaMeasurementId: z.string().optional(),
            umamiHost: z.string().optional(),
            umamiWebsiteId: z.string().optional(),
          })
          .optional(),
        // catalogue: z.record(z.unknown()).optional(),
        catalogue: z.string().optional(),
        authType: z.nativeEnum(AuthType).optional(),
        authConfig: z
          .object({
            privyAppId: z.string().optional(),
            privyAppSecret: z.string().optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      if (data.catalogue) {
        data.catalogue = JSON.parse(data.catalogue)
      }
      const newSite = await prisma.site.update({
        where: { id },
        include: { domains: true },
        data,
      })

      try {
        await syncSiteToHub(newSite)
      } catch (error) {}

      revalidateSite(newSite.domains)

      await cacheHelper.updateCachedMySites(ctx.token.uid, null)
      await cacheHelper.updateCachedHomeSites(null)
      return newSite
    }),

  enableFeatures: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        journal: z.boolean(),
        gallery: z.boolean(),
        page: z.boolean(),
        database: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { siteId, ...features } = input

      let site = await prisma.site.findUniqueOrThrow({
        where: { id: siteId },
      })
      site = await prisma.site.update({
        where: { id: siteId },
        data: {
          config: {
            ...(site.config as any),
            features,
          },
        },
      })

      return site
    }),

  addSubdomain: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        domain: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { siteId } = input
      if (reservedDomains.includes(input.domain)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `"${input.domain}" is reserved and cannot be used.`,
        })
      }

      const newDomain = await prisma.domain.create({
        data: {
          domain: input.domain,
          isSubdomain: true,
          subdomainType: SubdomainType.Custom,
          siteId,
        },
      })

      const domains = await prisma.domain.findMany({
        where: { siteId: siteId },
      })
      revalidateSite(domains)

      await cacheHelper.updateCachedMySites(ctx.token.uid, null)
      await cacheHelper.updateCachedHomeSites(null)
      return newDomain
    }),

  deleteSubdomain: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        domainId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.domain.delete({
        where: { id: input.domainId },
      })

      const domains = await prisma.domain.findMany({
        where: { siteId: input.siteId },
      })
      revalidateSite(domains)
      await cacheHelper.updateCachedMySites(ctx.token.uid, null)
      await cacheHelper.updateCachedHomeSites(null)
      return true
    }),

  customDomain: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        domain: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { siteId } = input

      const customDomain = await prisma.domain.findFirst({
        where: {
          isSubdomain: false,
          siteId: input.siteId,
        },
      })

      if (customDomain) {
        await prisma.domain.update({
          where: { id: customDomain.id },
          data: { domain: input.domain },
        })

        const res = await addDomainToVercel(input.domain)
        const domains = await prisma.domain.findMany({
          where: { siteId: siteId },
        })
        revalidateSite(domains)
        return
      }

      try {
        await prisma.domain.create({
          data: {
            domain: input.domain,
            isSubdomain: false,
            siteId,
          },
        })

        const res = await addDomainToVercel(input.domain)

        const domains = await prisma.domain.findMany({
          where: { siteId: siteId },
        })
        revalidateSite(domains)
        await cacheHelper.updateCachedMySites(ctx.token.uid, null)
        await cacheHelper.updateCachedHomeSites(null)
        return res
      } catch (error) {
        console.log('===error:', error)

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Domain is already taken',
        })
      }
    }),

  deleteSite: publicProcedure.mutation(async ({ ctx, input }) => {
    const userId = ctx.token.uid
    return prisma.$transaction(
      async (tx) => {
        const site = await tx.site.findFirst({ where: { userId } })

        if (site?.userId !== ctx.token.uid) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'No permission to delete site',
          })
        }

        const siteId = site?.id
        await tx.message.deleteMany({ where: { siteId } })
        await tx.channel.deleteMany({ where: { siteId } })
        await tx.author.deleteMany({ where: { siteId } })
        await tx.node.deleteMany({ where: { userId } })
        await tx.post.deleteMany({ where: { siteId } })
        await tx.comment.deleteMany({ where: { userId } })
        await tx.postTag.deleteMany({ where: { siteId } })
        await tx.tag.deleteMany({ where: { siteId } })
        await tx.collaborator.deleteMany({ where: { siteId } })
        await tx.domain.deleteMany({ where: { siteId } })
        await tx.accessToken.deleteMany({ where: { siteId } })
        await tx.assetLabel.deleteMany({ where: { siteId } })
        await tx.label.deleteMany({ where: { siteId } })
        await tx.assetAlbum.deleteMany({ where: { siteId } })
        await tx.album.deleteMany({ where: { siteId } })
        await tx.asset.deleteMany({ where: { siteId } })
        await tx.block.deleteMany({ where: { siteId } })
        await tx.page.deleteMany({ where: { siteId } })
        await tx.record.deleteMany({ where: { siteId } })
        await tx.field.deleteMany({ where: { siteId } })
        await tx.view.deleteMany({ where: { siteId } })
        await tx.database.deleteMany({ where: { siteId } })
        await tx.subscriber.deleteMany({ where: { siteId } })
        await tx.delivery.deleteMany({ where: { siteId } })
        await tx.newsletter.deleteMany({ where: { siteId } })
        await tx.site.delete({ where: { id: siteId } })
        await tx.hostedSite.deleteMany({ where: { userId } })
        await tx.subscription.deleteMany({ where: { userId } })
        await tx.account.deleteMany({ where: { userId } })
        await tx.user.delete({ where: { id: userId } })

        await cacheHelper.updateCachedMySites(ctx.token.uid, null)
        await cacheHelper.updateCachedHomeSites(null)
        return true
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
      },
    )
  }),
})
