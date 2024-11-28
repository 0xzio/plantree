import { addDomainToVercel } from '@/lib/domains'
import { prisma } from '@/lib/prisma'
import { AuthType, StorageProvider } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const siteRouter = router({
  list: publicProcedure.query(async () => {
    return prisma.site.findMany({
      include: {
        domains: true,
      },
    })
  }),

  mySites: publicProcedure.query(async () => {
    return prisma.site.findMany({
      include: {
        channels: true,
      },
    })
  }),

  getSite: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return prisma.site.findUniqueOrThrow({
        where: { id: input.id },
      })
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
      })
    }),

  updateSite: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        logo: z.string().optional(),
        name: z.string().optional(),
        subdomain: z.string().optional(),
        description: z.string().optional(),
        about: z.string().optional(),
        themeName: z.string().optional(),
        spaceId: z.string().optional(),
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
        data,
      })

      revalidatePath('/', 'layout')
      revalidatePath('/', 'page')
      revalidatePath('/about/page', 'page')
      revalidatePath('/~', 'layout')
      return newSite
    }),

  customDomain: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        domain: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input

      const domain = await prisma.domain.findUnique({
        where: {
          domain: input.domain,
          isSubdomain: false,
        },
      })

      if (!domain) {
        await prisma.domain.create({
          data: {
            domain: input.domain,
            isSubdomain: false,
            siteId: id,
          },
        })
      } else {
        await prisma.domain.update({
          where: { id: domain.id },
          data: { domain: input.domain },
        })
      }

      const res = await addDomainToVercel(input.domain)
      return res
    }),
})
