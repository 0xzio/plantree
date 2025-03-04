import { prisma } from '@/lib/prisma'
import { TierInterval } from '@prisma/client'
import Stripe from 'stripe'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const tierRouter = router({
  listSiteTiers: protectedProcedure.query(async ({ ctx, input }) => {
    const tiers = await prisma.tier.findMany({
      where: { siteId: ctx.activeSiteId },
    })

    return tiers
  }),

  addTier: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, { message: 'Tier name is required' }),
        price: z.string().min(1, { message: 'Price is required' }),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const site = await prisma.site.findUniqueOrThrow({
        where: { id: ctx.activeSiteId },
      })

      let stripeOAuthToken = site.stripeOAuthToken as Stripe.OAuthToken

      const oauthStripe = new Stripe(stripeOAuthToken.access_token!, {
        apiVersion: '2025-02-24.acacia',
        typescript: true,
      })

      const product = await oauthStripe.products.create({
        name: input.name,
        description: input.name,
        tax_code: 'txcd_10103000',
      })

      const monthlyPrice = await oauthStripe.prices.create({
        unit_amount: parseInt((Number(input.price) * 100) as any), // $10
        currency: 'usd',
        recurring: { interval: 'month' },
        product: product.id,
      })

      await prisma.tier.create({
        data: {
          ...input,
          price: Number(input.price),
          interval: TierInterval.MONTHLY,
          stripeProductId: product.id,
          stripePriceId: monthlyPrice.id,
          siteId: site.id,
          userId: ctx.token.uid,
        },
      })

      return true
    }),

  updateTier: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, { message: 'Tier name is required' }),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input
      return prisma.tier.update({
        where: { id: input.id },
        data: rest,
      })
    }),
})
