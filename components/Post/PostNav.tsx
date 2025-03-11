'use client'

import { usePost } from '@/hooks/usePost'
import { usePostSaving } from '@/hooks/usePostSaving'
import { BUILTIN_PAGE_SLUGS, ROOT_DOMAIN } from '@/lib/constants'
import { getSiteDomain } from '@/lib/getSiteDomain'
import { Link } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { PostStatus } from '@prisma/client'
import { ChevronLeft, ExternalLink } from 'lucide-react'
import { useSiteContext } from '../SiteContext'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { MoreMenu } from './MoreMenu'
import { PublishDialog } from './PublishDialog/PublishDialog'
import { usePublishDialog } from './PublishDialog/usePublishDialog'

interface PostHeaderProps {
  className?: string
}
export function PostNav({ className }: PostHeaderProps) {
  const { post } = usePost()
  const { isPostSaving } = usePostSaving()
  const site = useSiteContext()
  const { isSubdomain, domain } = getSiteDomain(site as any)
  const host = isSubdomain ? `${domain}.${ROOT_DOMAIN}` : domain
  const { setIsOpen } = usePublishDialog()

  let prefix = post?.isPage ? '/pages' : '/posts'
  if (BUILTIN_PAGE_SLUGS.includes(post?.slug)) {
    prefix = ''
  }

  return (
    <div
      className={cn(
        'flex items-center space-x-3 justify-between fixed md:sticky right-0 left-0 bottom-0 md:top-0 h-12 px-2 bg-background z-20',
        className,
      )}
    >
      <div className="flex items-center gap-6">
        <Link
          href={post?.isPage ? '/~/pages' : '/~/posts'}
          className="inline-flex w-8 h-8 text-foreground items-center justify-center bg-accent rounded-xl cursor-pointer flex-shrink-0"
        >
          <ChevronLeft size={20} />
        </Link>

        {post?.status === PostStatus.PUBLISHED && (
          <div className="hidden md:flex items-center gap-1">
            <a
              href={`${location.protocol}//${host}${prefix}/${post.slug}`}
              target="_blank"
              className="text-foreground/40 hover:text-foreground/80 flex items-center gap-1 text-sm"
            >
              <span>{`${prefix}/${post.slug}`}</span>
              <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>

      {post && (
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-accent px-2 py-1 text-sm text-foreground/40">
            {isPostSaving ? 'Saving...' : 'Saved'}
          </div>
          <PublishDialog />
          <Button
            size="sm"
            // variant="secondary"
            className={cn('w-24', className)}
            onClick={() => {
              setIsOpen(true)
            }}
          >
            Publish
          </Button>
          <MoreMenu post={post} />
        </div>
      )}
    </div>
  )
}
