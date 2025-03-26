import { prisma } from '@/lib/prisma'
import { Balance } from '@/lib/types'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const affiliateRouter = router({
  commissionBalance: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: ctx.token.uid },
    })
    if (!user?.commissionBalance) {
      return {
        withdrawable: 0,
        withdrawing: 0,
        locked: 0,
      } as Balance
    }
    return user?.commissionBalance as Balance
  }),

  withdrawCommission: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.token.uid
      const siteId = ctx.activeSiteId
      return prisma.$transaction(
        async (tx) => {
          const site = await tx.site.findUniqueOrThrow({
            where: { id: siteId },
          })

          if (site.userId !== userId) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'No permission to withdraw funds from this site',
            })
          }

          const amount = input.amount
          const balance = site.balance as Balance

          if (amount > balance.withdrawable) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Insufficient funds to withdraw this amount',
            })
          }

          balance.withdrawable -= amount
          balance.withdrawing += amount

          const newSite = await tx.site.update({
            where: { id: siteId },
            data: { balance },
          })

          await tx.payout.create({
            data: {
              userId,
              siteId,
              amount,
            },
          })
          return newSite
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
        },
      )
    }),
})
