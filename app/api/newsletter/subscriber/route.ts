import { prisma } from '@/lib/prisma'
import { NextResponse, NextRequest } from 'next/server'
import { SubscriberStatus } from '@prisma/client'
import { getToken } from 'next-auth/jwt'

// Subscribe to newsletter (requires authentication)
export async function POST(req: NextRequest) {
  try {
    // Get user token from request
    const token = await getToken({ req })
    
    if (!token?.sub) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { email, siteId } = await req.json()

    if (!email || !siteId) {
      return NextResponse.json(
        { error: 'Email and siteId are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if already subscribed
    const existingSubscriber = await prisma.subscriber.findFirst({
      where: {
        email,
        siteId,
        userId: token.sub, // Add userId to query
      },
    })

    if (existingSubscriber) {
      if (existingSubscriber.status === SubscriberStatus.UNSUBSCRIBED) {
        // If previously unsubscribed, reactivate subscription
        await prisma.subscriber.update({
          where: { id: existingSubscriber.id },
          data: { status: SubscriberStatus.ACTIVE },
        })
        return NextResponse.json({ message: 'Subscription reactivated' })
      }
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 400 }
      )
    }

    // Create new subscription with authenticated user's ID
    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        siteId,
        status: SubscriberStatus.ACTIVE,
        source: 'web',
        userId: token.sub, // Use authenticated user's ID
      },
    })

    return NextResponse.json({
      message: 'Subscribed successfully',
      data: subscriber,
    })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
