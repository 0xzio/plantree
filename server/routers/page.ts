import { cacheHelper } from '@/lib/cache-header'
import { prisma } from '@/lib/prisma'
import { PostStatus } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { slug } from 'github-slugger'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { createPage } from '../lib/createPage'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const pageRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cachedPages = await cacheHelper.getCachedSitePages(input.siteId)
      if (cachedPages) return cachedPages
      const pages = await prisma.post.findMany({
        where: {
          siteId: input.siteId,
          isJournal: false,
          isPage: true,
        },
        orderBy: { createdAt: 'desc' },
      })
      return pages
    }),

  getPage: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        pageId: z.string().optional(),
        date: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { pageId = '', date = '' } = input
      if (!pageId && !date) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either pageId or date is required.',
        })
      }

      if (pageId) {
        return prisma.post.findUniqueOrThrow({
          where: { id: pageId },
          include: {
            postTags: { include: { tag: true } },
            authors: {
              include: {
                user: {
                  select: {
                    name: true,
                    image: true,
                    displayName: true,
                    ensName: true,
                  },
                },
              },
            },
          },
        })
      } else {
        const page = await prisma.post.findFirst({
          where: { siteId: input.siteId, date },
          include: {
            postTags: { include: { tag: true } },
            authors: {
              include: {
                user: {
                  select: {
                    name: true,
                    image: true,
                    displayName: true,
                    ensName: true,
                  },
                },
              },
            },
          },
        })

        if (page) return page

        const { id } = await createPage({
          userId: ctx.token.uid,
          siteId: input.siteId,
          date,
          title: '',
          isJournal: true,
        })

        return prisma.post.findUniqueOrThrow({
          where: { id },
          include: {
            postTags: { include: { tag: true } },
            authors: {
              include: {
                user: {
                  select: {
                    name: true,
                    image: true,
                    displayName: true,
                    ensName: true,
                  },
                },
              },
            },
          },
        })
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        title: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const page = await createPage({
        userId: ctx.token.uid,
        siteId: input.siteId,
        title: '',
      })
      await cacheHelper.updateCachedSitePages(input.siteId, null)
      return page
    }),
})
