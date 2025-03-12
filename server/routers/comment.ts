import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const commentRouter = router({
  listByPostId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: postId }) => {
      console.log('post========>>>>id:', postId)

      const comments = await prisma.comment.findMany({
        // where: { postId, parentId: null }, // Only top-level comments (parentId === null) need to be queried
        where: { postId },
        include: {
          user: true,
          // parent: true,
        },
        orderBy: { createdAt: 'desc' },
      })
      return comments
    }),

  listByPostSlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const post = await prisma.post.findUniqueOrThrow({
        where: { siteId_slug: input },
      })

      const comments = await prisma.comment.findMany({
        where: { postId: post.id },
        include: {
          user: true,
        },
        orderBy: { createdAt: 'asc' },
      })
      return comments
    }),

  // Create a new comment
  create: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        siteId: z.string(),
        content: z.string(),
        parentId: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(
        async (tx) => {
          const newComment = await tx.comment.create({
            data: {
              content: input.content,
              siteId: input.siteId,
              postId: input.postId,
              userId: ctx.token.uid,
              parentId: input.parentId,
            },
          })

          if (input.parentId) {
            await tx.comment.update({
              where: { id: input.parentId },
              data: {
                replyCount: { increment: 1 },
              },
            })
          }

          const updatedPost = await tx.post.update({
            where: { id: input.postId },
            data: {
              commentCount: { increment: 1 },
            },
          })

          revalidatePath(`/posts/${updatedPost.slug}`)
          revalidatePath(`/`)

          return newComment
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
        },
      )
    }),

  listRepliesByCommentId: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: commentId }) => {
      const replies = await prisma.comment.findMany({
        where: { parentId: commentId },
        include: {
          user: true,
          parent: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      })

      return replies
    }),

  // Update an existing comment
  update: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedComment = await prisma.comment.update({
        where: { id: input.commentId },
        data: {
          content: input.content,
          updatedAt: new Date(),
        },
      })
      return updatedComment
    }),

  // Delete a comment
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: commentId }) => {
      const deletedComment = await prisma.comment.delete({
        where: { id: commentId },
      })
      return deletedComment
    }),
})
