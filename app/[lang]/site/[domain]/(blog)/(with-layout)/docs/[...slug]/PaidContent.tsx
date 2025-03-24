'use client'

import { useMemo } from 'react'
import { loadTheme } from '@/lib/loadTheme'
import { Site } from '@/lib/theme.types'
import { trpc } from '@/lib/trpc'
import { SubscriptionInSession } from '@/lib/types'
import { useSession } from '@/lib/useSession'
import { cn } from '@/lib/utils'
import { Post } from '@prisma/client'
import dynamic from 'next/dynamic'
import readingTime from 'reading-time'
import { GateCover } from './GateCover'

// const PostDetail: any = dynamic(
//   () => import(process.env.NEXT_PUBLIC_THEME!).then((mod) => mod.PostDetail),
//   { ssr: false },
// )

function getContent(post: Post, isGated = false) {
  let content = JSON.parse(post.content || '{}')
  if (!isGated) return content
  const len = content?.length || 0
  const index = len < 6 ? 2 : 4
  content = content?.slice(0, index) || []
  return content
}

function checkMembership(subscriptions: SubscriptionInSession[]) {
  if (!Array.isArray(subscriptions)) return false
  if (!subscriptions.length) return false
  const subscription = subscriptions[0]!
  if (Date.now() / 1000 < subscription.startTime + subscription.duration) {
    return true
  }
  return false
}

interface Props {
  site: Site
  postId: string
  post: Post
  prev: Post
  next: Post
}

export function PaidContent({ site, postId, post, next, prev }: Props) {
  const { data: session, status } = useSession()

  const { PostDetail } = loadTheme(site.themeName)

  if (status === 'loading') return null

  /**  not login */
  if (!session) {
    return (
      <div>
        <PostDetail
          site={site}
          post={{
            ...post,
            content: getContent(post, true),
            readingTime: readingTime(post.content),
          }}
          readable={false}
          next={next}
          prev={prev}
          className="min-h-[auto]"
        />

        <div className="mx-auto relative">
          <GateCover slug={post.slug} />
        </div>
      </div>
    )
  }

  return (
    <MyPaidContent
      site={site}
      postId={postId}
      post={post}
      next={next}
      prev={prev}
    />
  )
}

export function MyPaidContent({ site, postId, post, next, prev }: Props) {
  const { PostDetail } = loadTheme(site.themeName)
  const { data: subscription } = trpc.tier.mySubscriptionBySiteId.useQuery({
    siteId: site.id,
  })

  const isMember = useMemo(() => {
    if (!subscription) return false
    if (
      !subscription.sassCurrentPeriodEnd ||
      subscription.sassSubscriptionStatus === 'canceled'
    ) {
      return false
    }
    return new Date(subscription.sassCurrentPeriodEnd).getTime() > Date.now()
  }, [subscription])

  return (
    <div className="">
      <PostDetail
        site={site}
        post={{
          ...post,
          content: isMember ? getContent(post) : getContent(post, true),
          readingTime: readingTime(post.content),
        }}
        readable={isMember}
        next={next}
        prev={prev}
        className={cn(!isMember && 'min-h-[auto]')}
      />
      {!isMember && (
        <div className="mx-auto relative">
          <GateCover slug={post.slug} />
        </div>
      )}
    </div>
  )
}
