import { cacheHelper } from '@/lib/cache-header'
import { prisma } from '@/lib/prisma'
import { TierInterval } from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { getOAuthStripe } from '../lib/getOAuthStripe'
import { protectedProcedure, router } from '../trpc'

export const tierRouter = router({
  listSiteTiers: protectedProcedure.query(async ({ ctx, input }) => {
    const tiers = await prisma.tier.findMany({
      where: { siteId: ctx.activeSiteId },
    })

    return tiers
  }),

  mySubscriptionBySiteId: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const subscription = await prisma.subscription.findFirst({
        where: {
          siteId: input.siteId,
          userId: ctx.token.uid,
        },
      })
      if (!subscription) return null
      return subscription
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
      const siteId = ctx.activeSiteId

      const oauthStripe = await getOAuthStripe(siteId)

      const product = await oauthStripe.products.create({
        name: input.name,
        description: input.name,
        tax_code: 'txcd_10103000',
      })

      const price = parseInt((Number(input.price) * 100) as any)

      const monthlyPrice = await oauthStripe.prices.create({
        unit_amount: price, // $10
        currency: 'usd',
        recurring: { interval: 'month' },
        product: product.id,
      })

      await prisma.tier.create({
        data: {
          ...input,
          price,
          interval: TierInterval.MONTHLY,
          stripeProductId: product.id,
          stripePriceId: monthlyPrice.id,
          siteId,
          userId: ctx.token.uid,
        },
      })

      revalidateTag(`${ctx.activeSiteId}-tiers`)
      await cacheHelper.updateCachedMySites(ctx.token.uid, null)
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

      const tier = await prisma.tier.update({
        where: { id: input.id },
        data: rest,
      })

      revalidateTag(`${ctx.activeSiteId}-tiers`)
      await cacheHelper.updateCachedMySites(ctx.token.uid, null)
      return tier
    }),

  updatePrice: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        price: z.string().min(1, { message: 'Price is required' }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input
      const siteId = ctx.activeSiteId

      const price = parseInt((Number(input.price) * 100) as any)

      const tier = await prisma.tier.findUniqueOrThrow({
        where: { id: input.id },
      })

      const oauthStripe = await getOAuthStripe(siteId)

      const monthlyPrice = await oauthStripe.prices.create({
        unit_amount: price, // $10
        currency: 'usd',
        recurring: { interval: 'month' },
        product: tier.stripeProductId!,
      })

      await prisma.tier.update({
        where: { id: input.id },
        data: {
          price,
          stripePriceId: monthlyPrice.id,
        },
      })

      revalidateTag(`${ctx.activeSiteId}-tiers`)
      await cacheHelper.updateCachedMySites(ctx.token.uid, null)
      return tier
    }),
})
