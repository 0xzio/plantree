import { prisma } from '@/lib/prisma'
import { getServerSession, getSessionOptions } from '@/lib/session'
import { stripe } from '@/lib/stripe'
import { SessionData } from '@/lib/types'
import { BillingCycle } from '@prisma/client'
import { getIronSession, IronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Stripe } from 'stripe'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)

  const sessionId = url.searchParams.get('session_id')
  const billingCycle = url.searchParams.get('billingCycle') || ''
  const planType = url.searchParams.get('planType') || ''
  const siteId = url.searchParams.get('siteId') || ''

  if (!sessionId) {
    throw new Error('Invalid sessionId.')
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription'],
    })

    if (!session.customer || typeof session.customer === 'string') {
      throw new Error('Invalid customer data from Stripe.')
    }

    const customerId = session.customer.id

    console.log('=========>>>>:', session)

    const subscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id

    if (!subscriptionId) {
      throw new Error('No subscription found for this session.')
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price.product'],
    })

    console.log('========>>>>subscription:', subscription)

    const plan = subscription.items.data[0]?.price

    console.log('==========>>>>plan:', plan)

    if (!plan) {
      throw new Error('No plan found for this subscription.')
    }

    const productId = (plan.product as Stripe.Product).id

    if (!productId) {
      throw new Error('No product ID found for this subscription.')
    }

    const siteId = session.client_reference_id
    if (!siteId) {
      throw new Error("No site ID found in session's client_reference_id.")
    }

    const millisecondsPerMonth = 30 * 24 * 60 * 60 * 1000
    const millisecondsPerYear = 12 * 30 * 24 * 60 * 60 * 1000

    await prisma.site.update({
      where: { id: siteId },
      data: {
        sassCustomerId: customerId,
        sassSubscriptionId: subscriptionId,
        sassSubscriptionStatus: subscription.status,
        sassCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        sassBillingCycle: billingCycle as any,
        sassPlanType: planType as any,
        sassProductId: productId,
      },
    })

    /** auth session */
    {
      const sessionOptions = getSessionOptions()
      const session = await getIronSession<SessionData>(
        await cookies(),
        sessionOptions,
      )

      session.planType = planType
      session.subscriptionStatus = 'active'
      session.billingCycle = billingCycle

      session.currentPeriodEnd = new Date(
        Date.now() +
          (billingCycle === BillingCycle.MONTHLY
            ? millisecondsPerMonth
            : millisecondsPerYear),
      ).toISOString()

      await session.save()
    }

    return NextResponse.redirect(
      `${url.protocol}//${url.host}/~/settings/subscription`,
    )
  } catch (error) {
    console.error('Error handling successful checkout:', error)
    return NextResponse.redirect(new URL('/error', req.url))
  }
}
