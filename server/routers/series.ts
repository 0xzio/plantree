import { cacheHelper } from '@/lib/cache-header'
import { prisma } from '@/lib/prisma'
import { ChargeMode, SeriesType, TierInterval } from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { getOAuthStripe } from '../lib/getOAuthStripe'
import { protectedProcedure, router } from '../trpc'

export const seriesRouter = router({
  addSeries: protectedProcedure
    .input(
      z.object({
        seriesType: z.nativeEnum(SeriesType),
        logo: z.string().min(1, { message: 'Please upload your avatar' }),
        name: z.string().min(5, {
          message: 'Name must be at least 1 characters.',
        }),
        slug: z.string().min(1, { message: 'Slug is required' }),
        description: z.string(),
        // about: z.string(),
        chargeMode: z.nativeEnum(ChargeMode),
        price: z.string().min(1, { message: 'Price is required' }),
      }),
    )
    .mutation(async ({ ctx, input }) => {}),

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
