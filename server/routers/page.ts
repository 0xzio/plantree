import { cacheHelper } from '@/lib/cache-header'
import { FREE_PLAN_PAGE_LIMIT, FRIEND_DATABASE_NAME } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { Option } from '@/lib/types'
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
      const count = await prisma.post.count({
        where: { siteId: input.siteId, isPage: true },
      })

      if (count >= FREE_PLAN_PAGE_LIMIT) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You have reached the free plan page limit.',
        })
      }

      const page = await createPage({
        userId: ctx.token.uid,
        siteId: input.siteId,
        title: '',
      })
      await cacheHelper.updateCachedSitePages(input.siteId, null)
      return page
    }),

  submitFriendLink: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        data: z.object({
          name: z.string().min(1, { message: 'Name is required' }),
          introduction: z.string().min(5, { message: 'Name is required' }),
          avatar: z.string(),
          url: z.string().url(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log('input>>>>>>>:', input)
      const database = await prisma.database.findUniqueOrThrow({
        where: {
          siteId_slug: {
            siteId: input.siteId,
            slug: FRIEND_DATABASE_NAME,
          },
        },
        include: {
          fields: true,
        },
      })

      const recordFields = database.fields.reduce(
        (acc, field, index) => {
          let value: any
          if (input.data[field.name]) {
            value = input.data[field.name]
          }
          if (field.name === 'status') {
            const options = (field.options as any as Option[]) || []
            const option = options.find((o) => o.name === 'pending')
            if (option) value = [option.id]
          }
          return {
            ...acc,
            [field.id]: value,
          }
        },
        {} as Record<string, any>,
      )

      console.log('======recordFields:', recordFields)

      const count = await prisma.field.count({
        where: { databaseId: database.id },
      })

      await prisma.record.createMany({
        data: [
          {
            databaseId: database.id,
            sort: count + 1,
            fields: recordFields,
            siteId: input.siteId,
            userId: ctx.token.uid,
          },
        ],
      })
      revalidateTag(`${input.siteId}-friends`)

      return database
    }),
})
