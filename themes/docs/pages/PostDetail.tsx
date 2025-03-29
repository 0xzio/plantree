import { ReactNode } from 'react'
import { ContentRender } from '@/components/theme-ui/ContentRender'
import { Footer } from '@/components/theme-ui/Footer'
import { IPFSLink } from '@/components/theme-ui/IPFSLink'
import { PageTitle } from '@/components/theme-ui/PageTitle'
import { PaginationNav } from '@/components/theme-ui/PaginationNav'
import { PostActions } from '@/components/theme-ui/PostActions'
import { PostMetadata } from '@/components/theme-ui/PostMetadata'
import { PostSubtitle } from '@/components/theme-ui/PostSubtitle'
import { SubscribeNewsletterCard } from '@/components/theme-ui/SubscribeNewsletter/SubscribeNewsletterCard'
import { Toc } from '@/components/theme-ui/Toc'
import { Link } from '@/lib/i18n'
import { Post, Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'

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
    <div
      className="flex gap-x-16 pt-4"
      style={
        {
          '--header-height': '80px',
        } as any
      }
    >
      <div className={cn('flex-1 flex flex-col', className)}>
        <div className="mb-auto flex-1">
          <header className="space-y-4 pb-4">
            <div className="mb-4">
              <PageTitle className="mb-2 mt-8">{post.title}</PageTitle>
              {post.description && (
                <PostSubtitle>{post.description}</PostSubtitle>
              )}
            </div>
            <PostMetadata site={site} post={post} />
            <PostActions post={post} />
          </header>
          <div className="pt-2 md:pt-4">
            <div className="">
              <ContentRender content={post.content} />
            </div>

            <IPFSLink cid={post.cid} />

            <PaginationNav prev={prev} next={next} />
          </div>
        </div>
        <Footer className="mt-auto" site={site} />
      </div>

      <Toc
        content={post.content}
        className="sticky top-20 py-10 xl:block overflow-y-auto w-56 hidden pl-6"
        style={{
          height: 'calc(100vh - 4rem)',
        }}
      />
    </div>
  )
}
