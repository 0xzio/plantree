import { cacheHelper } from '@/lib/cache-header'
import { SubscriptionTarget } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { Balance } from '@/lib/types'
import { InvoiceType, StripeType } from '@prisma/client'
import type { Stripe } from 'stripe'

export async function handleEvent(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session

  if (session?.mode === 'payment') return

  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    )

    console.log('connected======checkout subscription:', subscription)

    await prisma.site.update({
      // where: { sassSubscriptionId: subscription.id },
      where: {
        id: session.client_reference_id!,
      },
      data: {
        sassSubscriptionId: subscription.id,
        sassCustomerId: subscription.customer as string,
        sassCurrentPeriodEnd: new Date(
          subscription.current_period_start * 1000,
        ),
      },
    })
  }

  if (event.type === 'invoice.payment_succeeded') {
    console.log('connected event==========>>>:', event)
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    )

    if (!subscription?.id) return

    const siteId = subscription.metadata.siteId
    const site = await prisma.site.findUniqueOrThrow({
      where: { id: siteId },
    })

    let balance = site.balance as Balance
    if (!balance) {
      balance = { withdrawable: 0, withdrawing: 0, locked: 0 }
    }

    const productId = subscription.metadata.productId
    const subscriptionTarget = subscription.metadata.subscriptionTarget

    if (site.stripeType === StripeType.PLATFORM && productId) {
      balance.withdrawable += event.data.object.amount_paid

      await prisma.invoice.create({
        data: {
          siteId,
          productId,
          type: InvoiceType.SUBSCRIPTION,
          amount: event.data.object.amount_paid,
          currency: event.data.object.currency,
          stripeInvoiceId: event.data.object.id,
          stripeInvoiceNumber: event.data.object.number,
          stripePeriodStart: event.data.object.period_start,
          stripePeriodEnd: event.data.object.period_end,
        },
      })
    }

    console.log('========SubscriptionTarget:', subscriptionTarget)

    if (subscriptionTarget === SubscriptionTarget.PENX) {
      const referral = await prisma.referral.findUnique({
        where: { userId: site.userId },
        include: { user: true },
      })

      console.log('=====referral:', referral)

      if (referral) {
        let balance = referral.user.commissionBalance as Balance
        if (!balance) {
          balance = { withdrawable: 0, withdrawing: 0, locked: 0 }
        }

        const rate = referral.user.commissionRate / 100
        const commissionAmount = event.data.object.amount_paid * rate
        balance.withdrawable += commissionAmount
        await prisma.user.update({
          where: { id: referral.inviterId },
          data: { commissionBalance: balance },
        })
      }

      await prisma.site.update({
        // where: { sassSubscriptionId: subscription.id },
        where: { id: siteId },
        data: {
          balance,
          sassSubscriptionId: subscription.id,
          sassCustomerId: subscription.customer as string,
          sassCurrentPeriodEnd: new Date(
            subscription.current_period_start * 1000,
          ),
        },
      })
    }

    await cacheHelper.updateCachedMySites(site.userId, null)
  }
  if (event.type === 'customer.subscription.updated') {
    //add customer logic
    console.log('event.type: ', event.type)
  }
  console.log('✅ Stripe Webhook Processed')
}
