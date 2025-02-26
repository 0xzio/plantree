import { prisma } from '@/lib/prisma'
import { getServerSession, getSessionOptions } from '@/lib/session'
import { SessionData } from '@/lib/types'
import { PlanType } from '@prisma/client'
import { getIronSession, IronSession } from 'iron-session'
import { cookies } from 'next/headers'
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

interface CancelRes {
  status: string
  current_period_start_date: string
  current_period_end_date: string
  canceled_at: string
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

  cancel: protectedProcedure.mutation(async ({ ctx, input }) => {
    const site = await prisma.site.findUniqueOrThrow({
      where: { id: ctx.activeSiteId },
    })

    const res: CancelRes = await fetch(
      `${process.env.CREEM_API_HOST}/v1/subscriptions/${site.sassSubscriptionId}/cancel`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
      },
    ).then((response) => response.json())
    console.log('>>>>====res:', res)

    await prisma.site.update({
      where: { id: ctx.activeSiteId },
      data: {
        // sassPlanType: PlanType.FREE,
        // sassProductId: null,
        sassSubscriptionStatus: 'canceled',
        sassCurrentPeriodEnd: new Date(res.current_period_end_date),
        // sassSubscriptionId: null,
      },
    })

    const sessionOptions = getSessionOptions()
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    )

    session.subscriptionStatus = 'canceled'

    await session.save()

    return true
  }),
})
