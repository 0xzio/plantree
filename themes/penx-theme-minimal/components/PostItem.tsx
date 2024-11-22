import { Post, Site } from '@penxio/types'
import { formatDate } from '@penxio/utils'
import Link from './Link'

interface PostItemProps {
  site: Site
  post: Post
}

export function PostItem({ site, post }: PostItemProps) {
  const { slug, title } = post

  return (
    <Link
      key={slug}
      href={`/@${site.subdomain}/posts/${slug}`}
      className="hover:text-black flex items-center justify-between gap-6 text-foreground/80"
    >
      <div className="text-lg">{title}</div>
      <time className="text-sm text-foreground/50">
        {formatDate(post.updatedAt)}
      </time>
    </Link>
  )
}
