import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import type { Stripe } from 'stripe'

export async function handleEvent(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session
  console.log('event session>>>>>>>>>>>>>>>>>>', session)

  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    )

    await prisma.site.update({
      where: { sassSubscriptionId: subscription.id },
      data: {
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

    await prisma.site.update({
      where: { sassSubscriptionId: subscription.id },
      data: {
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
