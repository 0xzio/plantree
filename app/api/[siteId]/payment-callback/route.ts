import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { getServerSession, getSessionOptions } from '@/lib/session'
import { SessionData } from '@/lib/types'
import { BillingCycle } from '@prisma/client'
import { getIronSession, IronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const apiKey = process.env.CREEM_API_KEY!

export async function GET(req: NextRequest) {
  const url = new URL(req.url)

  const siteId = url.pathname.split('/')[2]

  const request_id = url.searchParams.get('request_id') || ''
  const checkout_id = url.searchParams.get('checkout_id')!
  const order_id = url.searchParams.get('order_id')!
  const customer_id = url.searchParams.get('customer_id')!
  const subscription_id = url.searchParams.get('subscription_id')!
  const product_id = url.searchParams.get('product_id')!
  const signature = url.searchParams.get('signature')!

  const params = {
    request_id,
    checkout_id,
    order_id,
    customer_id,
    subscription_id,
    product_id,
  }

  console.log('=======>>>signature:', signature)
  console.log('=======generateSignature:', generateSignature(params))
  console.log('=======params:', params)

  if (signature !== generateSignature(params)) {
    throw new Error('INVALID_SIGNATURE')
  }

  const [planType, billingCycle] = request_id.split('___')

  const millisecondsPerMonth = 30 * 24 * 60 * 60 * 1000
  const millisecondsPerYear = 12 * 30 * 24 * 60 * 60 * 1000

  await prisma.site.update({
    where: { id: siteId },
    data: {
      sassCustomerId: customer_id,
      sassSubscriptionId: subscription_id,
      sassSubscriptionStatus: 'active',
      sassBillingCycle: billingCycle as any,
      sassPlanType: planType as any,
      sassProductId: product_id,
    },
  })

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

  return NextResponse.redirect(
    `${url.protocol}//${url.host}/~/settings/subscription`,
  )
}

function generateSignature(params: any): string {
  const data = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .concat(`salt=${apiKey}`)
    .join('|')
  return crypto.createHash('sha256').update(data).digest('hex')
}
