import { isSuperAdmin } from '@/lib/isSuperAdmin'
import { prisma } from '@/lib/prisma'
import { uniqueId } from '@/lib/unique-id'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const couponRouter = router({
  list: protectedProcedure.query(async ({ ctx, input }) => {
    return prisma.coupon.findMany()
  }),

  batchCreate: protectedProcedure
    .input(
      z.object({
        months: z.number(),
        amount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!isSuperAdmin(ctx.token.uid)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Only super admins can create coupons',
        })
      }
      const ONE_MONTH = 60 * 60 * 24 * 30
      const arr = Array(input.amount)
        .fill(null)
        .map((_, index) => {
          return prisma.coupon.create({
            data: {
              planId: '1',
              code: uniqueId(),
              duration: ONE_MONTH * input.months,
            },
          })
        })
      await Promise.all(arr)
      return true
    }),
})
