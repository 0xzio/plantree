import { Post, Site } from '@/lib/theme.types'
import { cn, formatDate } from '@/lib/utils'
import { LangSwitcher } from './LangSwitcher'

interface Props {
  className?: string
  site: Site
  post: Post
}

export function PostMetadata({ site, post, className }: Props) {
  return (
    <div className="flex items-center justify-between">
      <dl className="flex items-center gap-2 text-foreground/50 text-sm">
        <dt className="sr-only">Published on</dt>
        <dd className="">
          <time>{formatDate(post.updatedAt)}</time>
        </dd>
        <dd>·</dd>
        <dd className="">{post.readingTime.text}</dd>
      </dl>
      <LangSwitcher site={site} />
    </div>
  )
}
