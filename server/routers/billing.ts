import {
  CREEM_PRODUCT_PROFESSIONAL_ANNUAL,
  CREEM_PRODUCT_PROFESSIONAL_MONTHLY,
  CREEM_PRODUCT_STANDARD_ANNUAL,
  CREEM_PRODUCT_STANDARD_MONTHLY,
} from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { getServerSession, getSessionOptions } from '@/lib/session'
import { SessionData } from '@/lib/types'
import { BillingCycle, PlanType } from '@prisma/client'
import { getIronSession, IronSession } from 'iron-session'
import { cookies } from 'next/headers'
import queryString from 'query-string'
import Stripe from 'stripe'
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

export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

export const billingRouter = router({
  checkout: protectedProcedure
    .input(
      z.object({
        planType: z.nativeEnum(PlanType),
        billingCycle: z.nativeEnum(BillingCycle),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const getProductId = () => {
        // if (input.planType === PlanType.STANDARD) {
        //   return input.billingCycle === BillingCycle.MONTHLY
        //     ? CREEM_PRODUCT_STANDARD_MONTHLY
        //     : CREEM_PRODUCT_STANDARD_ANNUAL
        // } else {
        //   return input.billingCycle === BillingCycle.MONTHLY
        //     ? CREEM_PRODUCT_PROFESSIONAL_MONTHLY
        //     : CREEM_PRODUCT_PROFESSIONAL_ANNUAL
        // }
        //
        return process.env.NEXT_PUBLIC_STRIPE_CREATOR_MONTHLY_PLAN_ID
      }

      const return_url = `${process.env.NEXT_PUBLIC_ROOT_HOST}/api/${ctx.activeSiteId}/payment-callback`

      console.log('=====>>>success_url:', return_url)
      const userId = ctx.token.uid

      const query = {
        billingCycle: input.billingCycle,
        planType: input.planType,
        siteId: ctx.activeSiteId,
      }

      console.log('=======query:', query)

      const stringifiedQuery = queryString.stringify(query)

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        // customer_email: email,
        client_reference_id: ctx.activeSiteId,
        subscription_data: { metadata: { userId } },
        success_url: `${return_url}?success=truesession_id={CHECKOUT_SESSION_ID}&session_id={CHECKOUT_SESSION_ID}&${stringifiedQuery}`,
        cancel_url: `${return_url}?success=false`,
        line_items: [{ price: getProductId(), quantity: 1 }],
      })

      if (!session.url) return { success: false as const }

      return { success: true, url: session.url }
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
          // 'x-api-key': apiKey,
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
