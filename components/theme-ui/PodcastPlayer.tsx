'use client'

import { useEffect, useRef } from 'react'
import { Post } from '@/lib/theme.types'
import { cn, getUrl } from '@/lib/utils'
import { Player } from 'shikwasa'
import { useSiteContext } from '../SiteContext'
import { Skeleton } from '../ui/skeleton'

interface Props {
  post: Post
  className?: string
}

export function PodcastPlayer({ post, className }: Props) {
  const playerRef = useRef<any>(null)
  const site = useSiteContext()

  console.log('====site.image ', site, post)

  useEffect(() => {
    playerRef.current = new Player({
      container: () => document.querySelector('.podcast-audio'),
      // fixed: {
      //   type: 'fixed',
      //   position: 'bottom',
      // },
      themeColor: 'black',
      theme: 'light',
      download: true,
      preload: 'metadata',
      audio: {
        title: post.title,
        artist:
          post?.authors[0]?.user?.displayName ||
          post?.authors[0]?.user?.name ||
          '',
        cover: post.image
          ? getUrl(post.image || '')
          : getUrl(site.logo || site.image || ''),
        // src: 'https://r2.penx.me/8283074160_460535.mp3',
        // src: 'https://v.typlog.com/sspai/8267989755_658478.mp3'
        src: getUrl(post.media || ''),
      },
    })

    window.__PLAYER__ = playerRef.current
  }, [])

  return (
    <div className={cn('podcast-audio w-full', className)}>
      <div className="h-[120px] shadow w-full flex justify-between items-center p-3 border border-foreground/10 bg-background">
        <div className="flex items-center gap-6">
          <Skeleton className="h-24 w-28" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Skeleton className="size-7 rounded-full" />
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="size-7 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default PodcastPlayer
