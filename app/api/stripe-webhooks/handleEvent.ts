import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { Balance } from '@/lib/types'
import { StripeType } from '@prisma/client'
import type { Stripe } from 'stripe'

export async function handleEvent(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session

  if (session?.mode === 'payment') return

  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    )

    console.log('======checkout subscription:', subscription)

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
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    )

    const siteId = subscription.metadata.siteId
    const site = await prisma.site.findUniqueOrThrow({
      where: { id: siteId },
    })

    let balance = site.balance as Balance
    if (balance) {
      balance = {
        withdrawable: 0,
        withdrawing: 0,
        locked: 0,
      }
    }

    const tierId = subscription.metadata.tierId

    if (site.stripeType === StripeType.PLATFORM && tierId) {
      const { price } = await prisma.tier.findUniqueOrThrow({
        where: { id: tierId },
        select: { price: true },
      })

      balance.withdrawable += price

      await prisma.invoice.create({
        data: {
          siteId,
          amount: event.data.object.amount_paid,
          currency: event.data.object.currency,
          stripeInvoiceId: event.data.object.id,
          stripeInvoiceNumber: event.data.object.number,
          stripePeriodStart: event.data.object.period_start,
          stripePeriodEnd: event.data.object.period_end,
        },
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
  if (event.type === 'customer.subscription.updated') {
    //add customer logic
    console.log('event.type: ', event.type)
  }
  console.log('✅ Stripe Webhook Processed')
}
