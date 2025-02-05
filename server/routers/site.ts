import { addDomainToVercel } from '@/lib/domains'
import { prisma } from '@/lib/prisma'
import { redisKeys } from '@/lib/redisKeys'
import { revalidateSite } from '@/lib/revalidateSite'
import {
  AuthType,
  CollaboratorRole,
  SiteMode,
  StorageProvider,
  SubdomainType,
} from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { config } from 'googleapis/build/src/apis/config'
import Redis from 'ioredis'
import { z } from 'zod'
import { syncSiteToHub } from '../lib/syncSiteToHub'
import { protectedProcedure, publicProcedure, router } from '../trpc'

const redis = new Redis(process.env.REDIS_URL!)

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

  mySites: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.token.uid
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

    return sites
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
        mode: z.nativeEnum(SiteMode).optional(),
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
            medium: z.string().optional(),
          })
          .optional(),
        authType: z.nativeEnum(AuthType).optional(),
        authConfig: z
          .object({
            privyAppId: z.string().optional(),
            privyAppSecret: z.string().optional(),
          })
          .optional(),
        storageProvider: z.nativeEnum(StorageProvider).optional(),
        storageConfig: z
          .object({
            vercelBlobToken: z.string().optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      const newSite = await prisma.site.update({
        where: { id },
        include: { domains: true },
        data,
      })

      try {
        await syncSiteToHub(newSite)
      } catch (error) {}

      revalidateSite(newSite.domains)
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
      console.log('=====features:', features)

      let site = await prisma.site.findUniqueOrThrow({
        where: { id: siteId },
      })
      site = await prisma.site.update({
        where: { id: siteId },
        data: {
          config: {
            ...config,
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
        const siteId = site?.id
        await tx.message.deleteMany({ where: { siteId } })
        await tx.channel.deleteMany({ where: { siteId } })
        await tx.node.deleteMany({ where: { userId } })
        await tx.post.deleteMany({ where: { siteId } })
        await tx.comment.deleteMany({ where: { userId } })
        await tx.postTag.deleteMany({ where: { siteId } })
        await tx.tag.deleteMany({ where: { siteId } })
        await tx.collaborator.deleteMany({ where: { siteId } })
        await tx.domain.deleteMany({ where: { siteId } })
        await tx.accessToken.deleteMany({ where: { siteId } })
        await tx.site.delete({ where: { id: siteId } })
        await tx.account.deleteMany({ where: { userId } })
        await tx.user.delete({ where: { id: userId } })
        return true
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
      },
    )
  }),
})
