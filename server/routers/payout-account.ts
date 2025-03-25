import { prisma } from '@/lib/prisma'
import { StripeInfo } from '@/lib/types'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { getOAuthStripe } from '../lib/getOAuthStripe'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const payoutAccountRouter = router({
  byId: publicProcedure.input(z.string().uuid()).query(async ({ input }) => {
    const account = await prisma.payoutAccount.findFirst({
      where: { id: input },
    })
    if (!account) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Payout account not found',
      })
    }
    return account
  }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const products = await prisma.payoutAccount.findMany({
      where: { userId: ctx.token.uid },
    })
    return products
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
        description: z.string().optional(),
        details: z.any().optional(),
        image: z.any().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return prisma.$transaction(
        async (tx) => {
          const siteId = ctx.activeSiteId
          const oauthStripe = await getOAuthStripe(siteId)

          const product = await oauthStripe.products.create({
            name: input.name,
            description: input.description || input.name,
            tax_code: 'txcd_10000000',
          })

          const price = await oauthStripe.prices.create({
            unit_amount: input.price, // $10
            currency: 'usd',
            product: product.id,
          })

          return await tx.product.create({
            data: {
              ...input,
              stripe: {
                productId: product.id,
                priceId: price.id,
              } as StripeInfo,
              siteId,
              userId: ctx.token.uid,
            },
          })
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
        },
      )
    }),

  updateProduct: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
        details: z.any().optional(),
        image: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input
      const product = await prisma.product.update({
        where: { id: input.id },
        data: rest,
      })

      return product
    }),
})
