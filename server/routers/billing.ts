import {
  STRIPE_BELIEVER_PRICE_ID,
  STRIPE_PRO_MONTHLY_PRICE_ID,
  STRIPE_PRO_YEARLY_PRICE_ID,
  STRIPE_TEAM_MONTHLY_PRICE_ID,
  STRIPE_TEAM_YEARLY_PRICE_ID,
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
      const isBeliever = input.planType === PlanType.BELIEVER
      console.log(
        '======isBeliever:',
        isBeliever,
        'STRIPE_BELIEVER_PRICE_ID:',
        STRIPE_BELIEVER_PRICE_ID,
      )

      const getProductId = () => {
        if (isBeliever) return STRIPE_BELIEVER_PRICE_ID

        if (input.planType === PlanType.PRO) {
          return input.billingCycle === BillingCycle.MONTHLY
            ? STRIPE_PRO_MONTHLY_PRICE_ID
            : STRIPE_PRO_YEARLY_PRICE_ID
        }

        return input.billingCycle === BillingCycle.MONTHLY
          ? STRIPE_TEAM_MONTHLY_PRICE_ID
          : STRIPE_TEAM_YEARLY_PRICE_ID
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
        // mode: 'subscription',
        mode: isBeliever ? 'payment' : 'subscription',
        payment_method_types: ['card'],
        // customer_email: email,
        client_reference_id: ctx.activeSiteId,
        subscription_data: isBeliever
          ? undefined
          : {
              metadata: {
                siteId: ctx.activeSiteId,
                billingCycle: input.billingCycle,
                planType: input.planType,
              },
            },
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

    const subscriptionId = site.sassSubscriptionId as string

    try {
      const subscription = await stripe.subscriptions.cancel(subscriptionId)
      console.log('=========>>>>>>subscription:', subscription)

      console.log(`Subscription ${subscriptionId} cancelled successfully.`)

      const sassCurrentPeriodEnd = new Date(
        subscription.current_period_end * 1000,
      )
      await prisma.site.update({
        where: { id: ctx.activeSiteId },
        data: {
          // sassPlanType: PlanType.FREE,
          // sassProductId: null,
          // sassSubscriptionStatus: 'canceled',
          sassSubscriptionStatus: subscription.status,
          sassCurrentPeriodEnd: sassCurrentPeriodEnd,
          // sassSubscriptionId: null,
        },
      })

      const sessionOptions = getSessionOptions()
      const session = await getIronSession<SessionData>(
        await cookies(),
        sessionOptions,
      )

      session.subscriptionStatus = 'canceled'
      session.currentPeriodEnd = sassCurrentPeriodEnd.toISOString()

      await session.save()

      return true
    } catch (err) {
      console.error(`Error cancelling subscription: ${err}`)
      return false
    }
  }),
})
