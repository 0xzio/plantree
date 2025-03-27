import { ReactNode } from 'react'
import { Image } from '@/components/Image'
import { Post, Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { PostType } from '@prisma/client'
import { ContentRender } from './ContentRender'
import { IPFSLink } from './IPFSLink'
import { PageTitle } from './PageTitle'
import { PaginationNav } from './PaginationNav'
import PodcastPlayer from './PodcastPlayer'
import { PostActions } from './PostActions'
import { PostMetadata } from './PostMetadata'
import { PostSubtitle } from './PostSubtitle'
import { SubscribeNewsletterCard } from './SubscribeNewsletter/SubscribeNewsletterCard'

interface Props {
  site: Site
  post: Post
  children: ReactNode
  className?: string
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  titleClassName?: string
}

export function PostPageWidget({
  site,
  post,
  next,
  prev,
  className,
  titleClassName,
}: Props) {
  return (
    <div className={cn('flex-1 flex flex-col  mt-8', className)}>
      <div className="mb-auto flex-1">
        <header className="space-y-4 pb-4 ">
          <div className="mb-4">
            <PageTitle className={cn('mb-2 mt-0', titleClassName)}>
              {post.title}
            </PageTitle>
            {post.description && (
              <PostSubtitle>{post.description}</PostSubtitle>
            )}
          </div>
          <PostMetadata site={site} post={post} />
          <PostActions post={post} />
        </header>

        {!!post.image && (
          <Image
            src={post.image || ''}
            alt=""
            width={1000}
            height={800}
            className="object-cover w-full max-h-96 rounded-2xl"
          />
        )}

        <div className="pt-2 md:pt-4">
          <div className="flex flex-col gap-4">
            {post.type === PostType.AUDIO && (
              <div className="h-[130px] flex items-center mb-2">
                <PodcastPlayer post={post} />
              </div>
            )}
            <ContentRender content={post.content} />
            <SubscribeNewsletterCard site={site} />
          </div>

          <IPFSLink cid={post.cid} />
          <PaginationNav prev={prev} next={next} />
        </div>
      </div>
    </div>
  )
}
