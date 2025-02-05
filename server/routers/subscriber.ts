import { prisma } from '@/lib/prisma'
import { TRPCError } from '@trpc/server'
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
        emails: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(
        async (tx) => {
          for (const email of input.emails) {
            try {
              await prisma.subscriber.create({
                data: {
                  siteId: input.siteId,
                  email,
                  userId: ctx.token.uid,
                },
              })
            } catch (error: any) {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message:
                  error.code === 'P2002'
                    ? `Email "${email}" already exists`
                    : error.message,
              })
            }
          }

          return true
        },
        {
          maxWait: 1000 * 60, // default: 2000
          timeout: 1000 * 60, // default: 5000
        },
      )
    }),
})
