import { prisma } from '@/lib/prisma'
import { redisKeys } from '@/lib/redisKeys'
import { TRPCError } from '@trpc/server'
import { slug } from 'github-slugger'
import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'
import { getOAuthStripe } from '../lib/getOAuthStripe'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const orderRouter = router({
  list: protectedProcedure.query(async () => {
    const products = await prisma.product.findMany()
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
              stripeProductId: product.id,
              stripePriceId: price.id,
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
})
