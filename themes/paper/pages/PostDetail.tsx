import { ReactNode } from 'react'
import { ContentRender } from '@/components/theme-ui/ContentRender'
import { IPFSLink } from '@/components/theme-ui/IPFSLink'
import { PageTitle } from '@/components/theme-ui/PageTitle'
import { PaginationNav } from '@/components/theme-ui/PaginationNav'
import { PostActions } from '@/components/theme-ui/PostActions'
import { PostMetadata } from '@/components/theme-ui/PostMetadata'
import { PostSubtitle } from '@/components/theme-ui/PostSubtitle'
import { SubscribeNewsletterCard } from '@/components/theme-ui/SubscribeNewsletter/SubscribeNewsletterCard'
import { Post, Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import Link from '../components/Link'

interface LayoutProps {
  site: Site
  post: Post
  children: ReactNode
  className?: string
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export function PostDetail({ site, post, next, prev, className }: LayoutProps) {
  return (
    <div className={cn(className)}>
      <header className="space-y-4 pb-4">
        <div className="mb-4">
          <PageTitle>{post.title}</PageTitle>
          {post.description && <PostSubtitle>{post.description}</PostSubtitle>}
        </div>
        <PostMetadata site={site} post={post} />
        <PostActions post={post} />
      </header>
      <div className="grid-rows-[auto_1fr]">
        <div className="">
          <ContentRender content={post.content} />
          <SubscribeNewsletterCard site={site} />
        </div>
        <IPFSLink cid={post.cid} />
        <PaginationNav prev={prev} next={next} />
      </div>
    </div>
  )
}
