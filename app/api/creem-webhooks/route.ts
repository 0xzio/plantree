import { prisma } from '@/lib/prisma'
import { BillingCycle, PlanType } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import {
  isCheckoutCompleted,
  isSubscriptionActive,
  isSubscriptionCanceled,
  isSubscriptionPaid,
} from './event.types'

const apiKey = process.env.CREEM_API_KEY!

export async function POST(req: NextRequest) {
  const json = await req.json()
  console.log('==============>>>>>>>>>>>>:', json)

  if (isCheckoutCompleted(json)) {
    await prisma.site.update({
      where: { sassCustomerId: json.object.customer.id },
      data: {
        sassPlanType: json.object.metadata.planType as any,
        sassProductId: json.object.product.id,
        sassCurrentPeriodEnd: new Date(
          json.object.subscription.current_period_end_date,
        ),
        sassSubscriptionStatus: json.object.subscription.status,
        sassBillingCycle:
          json.object.product.billing_period === 'every-month'
            ? BillingCycle.MONTHLY
            : BillingCycle.ANNUAL,
        sassSubscriptionId: json.object.subscription.id,
      },
    })
  }

  if (isSubscriptionPaid(json)) {
    await prisma.site.update({
      where: { sassCustomerId: json.object.customer.id },
      data: {
        sassPlanType: json.object.metadata.planType as any,
        sassProductId: json.object.product.id,
        sassCurrentPeriodEnd: new Date(json.object.current_period_end_date),
        sassSubscriptionStatus: json.object.status,
        sassBillingCycle:
          json.object.product.billing_period === 'every-month'
            ? BillingCycle.MONTHLY
            : BillingCycle.ANNUAL,
        sassSubscriptionId: json.object.id,
      },
    })
  }

  if (isSubscriptionCanceled(json)) {
    await prisma.site.update({
      where: { sassCustomerId: json.object.customer.id },
      data: {
        // sassPlanType: PlanType.FREE,
        sassCurrentPeriodEnd: new Date(json.object.current_period_end_date),
        sassSubscriptionStatus: json.object.status,
      },
    })
  }

  return NextResponse.json({ ok: false })
}
