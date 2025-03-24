import { cacheHelper } from '@/lib/cache-header'
import { prisma } from '@/lib/prisma'
import { ChargeMode, SeriesType } from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { getOAuthStripe } from '../lib/getOAuthStripe'
import { protectedProcedure, router } from '../trpc'

export const seriesRouter = router({
  getSeriesList: protectedProcedure.query(async ({ ctx, input }) => {
    const tiers = await prisma.series.findMany({
      where: {
        siteId: ctx.activeSiteId,
      },
      include: { product: true },
    })

    return tiers
  }),

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
        chargeMode: z.nativeEnum(ChargeMode).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const series = await prisma.series.create({
        data: {
          siteId: ctx.activeSiteId,
          userId: ctx.token.uid,
          ...input,
        },
      })
      return series
    }),
})
