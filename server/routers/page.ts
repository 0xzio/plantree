import { editorDefaultValue, ELEMENT_P } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { uniqueId } from '@/lib/unique-id'
import { Page } from '@prisma/client'
import { z } from 'zod'
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
        where: { siteId: input.siteId },
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

  create: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        title: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newPage = await prisma.page.create({
        data: {
          userId: ctx.token.uid,
          props: {},
          children: [],
          ...input,
        },
      })

      const newBlock = await prisma.block.create({
        data: {
          userId: ctx.token.uid,
          pageId: newPage.id,
          parentId: newPage.id,
          content: editorDefaultValue[0],
          type: ELEMENT_P,
          props: {},
          children: [],
          siteId: input.siteId,
        },
      })

      await prisma.page.update({
        where: { id: newPage.id },
        data: { children: [newBlock.id] },
      })

      newPage.children = [newBlock.id]
      return newPage
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
