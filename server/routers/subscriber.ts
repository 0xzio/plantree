import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const subscriberRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return prisma.subscriber.findMany({
        where: { siteId: input.siteId },
      })
    }),

  create: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        email: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.subscriber.create({
        data: {
          ...input,
          userId: ctx.token.uid,
        },
      })
    }),
})
