import { isSuperAdmin } from '@/lib/isSuperAdmin'
import { prisma } from '@/lib/prisma'
import { uniqueId } from '@/lib/unique-id'
import { SubscriptionStatus } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

const ONE_MONTH = 60 * 60 * 24 * 30

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

  useCouponCode: protectedProcedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const coupon = await prisma.coupon.findUnique({
        where: { code: input.code },
      })

      if (!coupon) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Coupon code is invalid',
        })
      }
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: {
          isUsed: true,
        },
      })

      const subscription = await prisma.subscription.findFirst({
        where: { userId: ctx.token.uid },
      })

      if (subscription) {
        const remainTime =
          subscription.endedAt.getTime() > Date.now()
            ? subscription.endedAt.getTime() - Date.now()
            : 0

        const startedAt = new Date()
        const endedAt = startedAt.getTime() + ONE_MONTH * 1000 + remainTime

        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            planId: '1',
            status: SubscriptionStatus.ACTIVE,
            startedAt,
            endedAt: new Date(endedAt),
            userId: ctx.token.uid,
          },
        })
      } else {
        const startedAt = new Date()
        const endedAt = startedAt.getTime() + ONE_MONTH * 1000

        await prisma.subscription.create({
          data: {
            planId: '1',
            status: SubscriptionStatus.ACTIVE,
            startedAt,
            endedAt: new Date(endedAt),
            userId: ctx.token.uid,
          },
        })
      }

      return true
    }),
})
