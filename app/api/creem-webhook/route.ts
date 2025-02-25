import { prisma } from '@/lib/prisma'
import { PlanType } from '@prisma/client'
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
        sassSubscriptionId: json.object.id,
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
        sassSubscriptionId: json.object.id,
      },
    })
  }

  if (isSubscriptionCanceled(json)) {
    await prisma.site.update({
      where: { sassCustomerId: json.object.customer.id },
      data: {
        sassPlanType: PlanType.FREE,
        sassCurrentPeriodEnd: new Date(json.object.current_period_end_date),
      },
    })
  }

  return NextResponse.json({ ok: false })
}
