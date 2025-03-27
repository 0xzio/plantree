import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Post, Site } from '@/lib/theme.types'
import { cn, formatDate, formatUsername, getUrl } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { Separator } from '../ui/separator'
import { UserAvatar } from '../UserAvatar'
import { LangSwitcher } from './LangSwitcher'
import { CommentSheet } from './PostActions/Comment/CommentSheet'

interface Props {
  className?: string
  site: Site
  post: Post
}

export function PostMetadata({ site, post, className }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {post.authors.map((item, index) => (
            <UserAvatar
              key={item.id}
              address={item.user.displayName}
              className={cn('ring-2 ring-background', index > 0 && '-ml-3')}
              image={getUrl(item.user.image || '')}
            ></UserAvatar>
          ))}
        </div>
        <div className="leading-none">
          <div className="flex items-center">
            {post.authors.map((item, index) => (
              <div key={item.id} className="flex items-center">
                {index > 0 && (
                  <span className="text-sm text-foreground/50 mx-1">and</span>
                )}
                <span>{formatUsername(item.user.displayName)}</span>
              </div>
            ))}
          </div>
          <dl className="flex items-center gap-2 text-foreground/50 text-sm">
            <dt className="sr-only">
              <Trans>Published on</Trans>
            </dt>
            <dd className="">
              <time>{formatDate(post.updatedAt)}</time>
            </dd>
            <dd>·</dd>
            <dd className="">{post.readingTime.text}</dd>
          </dl>
        </div>
        {/* <LangSwitcher site={site} /> */}
      </div>

      <CommentSheet post={post} />
    </div>
  )
}
