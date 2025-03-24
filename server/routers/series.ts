import { prisma } from '@/lib/prisma'
import { ChargeMode, SeriesType } from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
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

  getSeriesById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const tiers = await prisma.series.findUniqueOrThrow({
        where: { id: input },
        include: {
          posts: true,
          // posts: {
          //   select: {
          //     id: true,
          //   },
          // },
        },
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
        about: z.string().optional(),
        chargeMode: z.nativeEnum(ChargeMode).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const series = await prisma.series.create({
        data: {
          siteId: ctx.activeSiteId,
          userId: ctx.token.uid,
          catalogue: [],
          ...input,
        },
      })
      return series
    }),

  updateSeries: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        seriesType: z.nativeEnum(SeriesType).optional(),
        logo: z
          .string()
          .min(1, { message: 'Please upload your avatar' })
          .optional(),
        name: z
          .string()
          .min(5, {
            message: 'Name must be at least 1 characters.',
          })
          .optional(),
        slug: z.string().min(1, { message: 'Slug is required' }).optional(),
        description: z.string().optional(),
        about: z.string().optional(),
        chargeMode: z.nativeEnum(ChargeMode).optional(),
        catalogue: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input
      const series = await prisma.series.update({
        where: { id },
        data: {
          ...rest,
        },
      })

      revalidateTag(`${series.siteId}-series-${series.slug}`)
      return series
    }),
})
