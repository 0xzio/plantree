import { prisma } from '@/lib/prisma'
import { redisKeys } from '@/lib/redisKeys'
import { TRPCError } from '@trpc/server'
import { slug } from 'github-slugger'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

function revalidate() {
  revalidatePath('/tags')
  revalidatePath('/(blogs)/tags/[tag]', 'page')
}

export const tagRouter = router({
  list: publicProcedure.query(async () => {
    const tags = await prisma.tag.findMany()
    return tags
  }),

  listSiteTags: publicProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const tags = await prisma.tag.findMany({
        where: { siteId: input.siteId },
      })
      return tags
    }),

  create: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        siteId: z.string(),
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return prisma.$transaction(
        async (tx) => {
          const tagName = slug(input.name)
          let tag = await tx.tag.findFirst({
            where: { name: tagName },
          })

          if (!tag) {
            tag = await tx.tag.create({
              data: {
                siteId: input.siteId,
                name: tagName,
                userId: ctx.token.uid,
              },
            })
          }

          const postTag = await tx.postTag.findFirst({
            where: { postId: input.postId, tagId: tag.id },
          })

          if (postTag) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Tag already exists',
            })
          }

          const newPostTag = await tx.postTag.create({
            data: {
              siteId: input.siteId,
              postId: input.postId,
              tagId: tag.id,
            },
          })
          revalidate()

          return tx.postTag.findUniqueOrThrow({
            include: { tag: true },
            where: { id: newPostTag.id },
          })
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
        },
      )
    }),

  add: protectedProcedure
    .input(
      z.object({
        tagId: z.string(),
        siteId: z.string(),
        postId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const postTag = await prisma.postTag.create({
        data: { ...input },
      })

      revalidate()

      return prisma.postTag.findUniqueOrThrow({
        include: { tag: true },
        where: { id: postTag.id },
      })
    }),

  deleteTag: protectedProcedure
    .input(
      z.object({
        tagId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.$transaction(
        async (tx) => {
          await tx.postTag.deleteMany({
            where: { tagId: input.tagId },
          })

          await tx.tag.delete({
            where: { id: input.tagId },
          })

          revalidate()
          return true
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
        },
      )
    }),

  deletePostTag: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const post = await prisma.postTag.delete({
        where: { id: input },
      })

      revalidate()
      return post
    }),
})
