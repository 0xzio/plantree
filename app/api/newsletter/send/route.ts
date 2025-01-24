import { prisma } from '@/lib/prisma'
import { NextResponse, NextRequest } from 'next/server'
import { NewsletterStatus, DeliveryStatus } from '@prisma/client'
import { getToken } from 'next-auth/jwt'

// Send newsletter when a post is published
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.sub) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { postId, siteId, title, content } = await req.json()

    if (!postId || !siteId || !title || !content) {
      return NextResponse.json(
        { error: 'PostId, siteId, title and content are required' },
        { status: 400 }
      )
    }

    // Create newsletter
    const newsletter = await prisma.newsletter.create({
      data: {
        title,
        subject: title, // Use post title as email subject
        content,
        postId,
        siteId,
        creatorId: token.sub,
        status: NewsletterStatus.SENDING,
        sentAt: new Date(),
      },
    })

    // Get all active subscribers
    const subscribers = await prisma.subscriber.findMany({
      where: {
        siteId,
        status: 'ACTIVE',
      },
    })

    if (subscribers.length === 0) {
      await prisma.newsletter.update({
        where: { id: newsletter.id },
        data: { status: NewsletterStatus.SENT },
      })
      return NextResponse.json({ 
        message: 'No active subscribers found',
        newsletterId: newsletter.id 
      })
    }

    // Create delivery records for each subscriber
    await prisma.delivery.createMany({
      data: subscribers.map(subscriber => ({
        newsletterId: newsletter.id,
        subscriberId: subscriber.id,
        siteId,
        status: DeliveryStatus.PENDING,
      })),
    })

    // Here you would typically trigger your email sending service
    // For example: await sendEmails(newsletter, subscribers)

    return NextResponse.json({
      message: `Newsletter created and queued for ${subscribers.length} subscribers`,
      data: {
        newsletterId: newsletter.id,
        subscriberCount: subscribers.length,
      },
    })

  } catch (error) {
    console.error('Send newsletter error:', error)
    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    )
  }
}

// Get newsletter sending status
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.sub) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const newsletterId = searchParams.get('newsletterId')

    if (!newsletterId) {
      return NextResponse.json(
        { error: 'NewsletterId is required' },
        { status: 400 }
      )
    }

    const deliveryStats = await prisma.delivery.groupBy({
      by: ['status'],
      where: {
        newsletterId,
      },
      _count: true,
    })

    return NextResponse.json({
      data: deliveryStats.reduce((acc, curr) => {
        acc[curr.status.toLowerCase()] = curr._count
        return acc
      }, {} as Record<string, number>),
    })

  } catch (error) {
    console.error('Get newsletter status error:', error)
    return NextResponse.json(
      { error: 'Failed to get newsletter status' },
      { status: 500 }
    )
  }
} 