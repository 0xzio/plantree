import { ROOT_DOMAIN } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { uniqueId } from '@/lib/unique-id'
import { createSubscriptionConfirmEmail } from '@/server/lib/getPostEmailTpl'
import {
  SubscriberStatus,
  SystemEmailStatus,
  SystemEmailType,
} from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

interface CheckoutRes {
  id: string
  object: string
  product: string
  units: any
  status: string
  checkout_url: string
  mode: string
}

const apiKey = process.env.CREEM_API_KEY!

export const billingRouter = router({
  checkout: protectedProcedure
    .input(
      z.object({
        planType: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const res: CheckoutRes = await fetch(
        `${process.env.CREEM_API_HOST}/v1/checkouts`,
        {
          method: 'POST',
          body: JSON.stringify({
            product_id: process.env.CREEM_PRODUCT_ID_CREATOR,
            request_id: `${input.planType}___${ctx.token.uid}`,
            success_url: `${process.env.NEXT_PUBLIC_ROOT_HOST}/api/${ctx.activeSiteId}/payment-callback`,
            // customer: {
            //   email: 'yourUserEmail@gmail.com',
            // },
            metadata: {
              planType: input.planType,
              userId: ctx.token.uid,
            },
          }),
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
        },
      ).then((response) => response.json())

      return res
    }),
})
