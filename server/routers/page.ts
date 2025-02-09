import { prisma } from '@/lib/prisma'
import { uniqueId } from '@/lib/unique-id'
import { Page, PageStatus } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { slug } from 'github-slugger'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { createPage } from '../lib/createPage'
import { protectedProcedure, publicProcedure, router } from '../trpc'

interface SlateElement {
  id: string
  [key: string]: any
}

export const pageRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return prisma.page.findMany({
        where: { siteId: input.siteId, isJournal: false },
        orderBy: { createdAt: 'desc' },
      })
    }),

  byId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const page = await prisma.page.findUniqueOrThrow({
      include: {
        blocks: true,
      },
      where: { id: input },
    })

    return page
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
        return prisma.page.findUniqueOrThrow({
          include: { blocks: true },
          where: { id: pageId },
        })
      } else {
        const page = await prisma.page.findFirst({
          include: { blocks: true },
          where: { siteId: input.siteId, date },
        })

        if (page) return page

        const { id } = await createPage({
          userId: ctx.token.uid,
          siteId: input.siteId,
          date,
          title: '',
          isJournal: true,
        })

        return prisma.page.findUniqueOrThrow({
          include: { blocks: true },
          where: { id },
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
      return createPage({
        userId: ctx.token.uid,
        siteId: input.siteId,
        title: '',
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        pageId: z.string(),
        title: z.string().optional(),
        elements: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let { pageId, elements, ...data } = input
      let slateElements = JSON.parse(elements || '[]') as SlateElement[]

      slateElements = slateElements.map((e) => ({
        ...e,
        id: e.id || uniqueId(),
      }))

      const children = slateElements.map((el) => el.id)

      const page = await prisma.page.update({
        where: { id: pageId },
        data: {
          ...data,
          children,
        },
      })

      const pageBlocks = await prisma.block.findMany({
        where: { pageId: pageId },
      })

      const blockIdsSet = new Set(pageBlocks.map((b) => b.id))

      const updated: SlateElement[] = []
      const added: SlateElement[] = []

      // console.log('=====updated:', updated, 'added:', added)

      for (const e of slateElements) {
        if (blockIdsSet.has(e.id)) {
          updated.push(e)
        } else {
          added.push(e)
        }
      }

      if (added.length) {
        const addedPromises = added.map(({ id, ...content }) => {
          return prisma.block.create({
            data: {
              id,
              siteId: page.siteId,
              userId: ctx.token.uid,
              pageId,
              parentId: pageId,
              type: content?.type,
              content: content,
              children: [],
              props: {},
            },
          })
        })

        await Promise.all(addedPromises)
      }

      const updatedPromises = updated.map(({ id, ...content }) => {
        return prisma.block.update({
          where: { id },
          data: { content },
        })
      })

      await Promise.all(updatedPromises)
      await cleanDeletedBlocks(page)

      return page
    }),

  delete: protectedProcedure
    .input(
      z.object({
        pageId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.block.deleteMany({ where: { pageId: input.pageId } })
      await prisma.page.delete({ where: { id: input.pageId } })
      return true
    }),

  publish: protectedProcedure
    .input(
      z.object({
        pageId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { pageId } = input
      let page = await prisma.page.findUniqueOrThrow({
        where: { id: pageId },
      })

      await prisma.page.update({
        where: { id: pageId },
        data: {
          status: PageStatus.PUBLISHED,
          publishedAt: new Date(),
          slug: slug(page.title || page.id),
        },
      })

      revalidateTag(`${page.siteId}-page-${page.slug}`)
      // revalidateTag(`${post.siteId}-posts`)
      // revalidatePath(`/posts/${post.slug}`)

      return page
    }),
})

async function cleanDeletedBlocks(page: Page) {
  const pageBlocks = await prisma.block.findMany({
    where: { pageId: page.id },
  })

  const promises: any[] = []

  for (const block of pageBlocks) {
    const blockIds = page.children as string[]
    if (!blockIds.includes(block.id)) {
      promises.push(prisma.block.delete({ where: { id: block.id } }))
    }
  }

  if (promises.length) await Promise.all(promises)
}
