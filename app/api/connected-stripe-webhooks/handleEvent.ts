import { cacheHelper } from '@/lib/cache-header'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import type { Stripe } from 'stripe'

export async function handleEvent(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session

  if (session?.mode === 'payment') return

  if (event.type === 'checkout.session.completed') {
    //
  }

  if (event.type === 'invoice.payment_succeeded') {
    console.log('connected event==========>>>:', event)
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    )

    if (!subscription?.id) return

    const siteId = subscription.metadata.siteId
    const userId = subscription.metadata.userId

    const site = await prisma.site.findUniqueOrThrow({
      where: { id: siteId },
    })

    const subscriptionTarget = subscription.metadata.subscriptionTarget

    console.log('========SubscriptionTarget:', subscriptionTarget)

    const dbSubscription = await prisma.subscription.findFirstOrThrow({
      where: { siteId, userId },
    })

    await prisma.subscription.update({
      where: { id: dbSubscription.id },
      data: {
        sassCurrentPeriodEnd: new Date(
          subscription.current_period_start * 1000,
        ),
      },
    })

    await cacheHelper.updateCachedMySites(site.userId, null)
  }
  if (event.type === 'customer.subscription.updated') {
    //add customer logic
    console.log('event.type: ', event.type)
  }
  console.log('✅ Stripe Webhook Processed')
}
