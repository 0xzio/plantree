import { calculateSHA256FromString } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'
import { redisKeys } from '@/lib/redisKeys'
import { TRPCError } from '@trpc/server'
import { slug } from 'github-slugger'
import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

function revalidate(siteId: string) {
  revalidateTag(`${siteId}-tags`)
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
            where: { name: tagName, siteId: input.siteId },
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
          revalidate(tag.siteId)

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
        include: { tag: true },
      })

      revalidate(postTag.siteId)
      revalidateTag(
        `${postTag.siteId}-tags-${calculateSHA256FromString(postTag.tag.name)}`,
      )
      return postTag
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
          const tag = await tx.tag.findUniqueOrThrow({
            where: { id: input.tagId },
          })
          await tx.postTag.deleteMany({
            where: { tagId: input.tagId },
          })

          await tx.tag.delete({
            where: { id: input.tagId },
          })

          revalidate(tag.siteId)
          revalidateTag(
            `${tag.siteId}-tags-${calculateSHA256FromString(tag.name)}`,
          )
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
      const postTag = await prisma.postTag.delete({
        where: { id: input },
        include: { tag: true },
      })

      revalidate(postTag.siteId)
      revalidateTag(
        `${postTag.siteId}-tags-${calculateSHA256FromString(postTag.tag.name)}`,
      )
      return postTag
    }),
})
