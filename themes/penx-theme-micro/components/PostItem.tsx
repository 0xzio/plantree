import { Post, Site } from '@penxio/types'
import { formatDate } from '@penxio/utils'
import Link from './Link'
import Tag from './Tag'

interface PostItemProps {
  site: Site
  post: Post
}

export function PostItem({ site, post }: PostItemProps) {
  const { slug, title } = post

  return (
    <div>
      <Link
        key={slug}
        href={`/@${site.subdomain}/posts/${slug}`}
        className="hover:text-black flex items-center justify-between gap-6 text-foreground/80"
      >
        <div className="text-lg">{title}</div>
      </Link>

      <div className="flex items-center text-sm gap-3">
        <div className="text-sm text-foreground/50">
          {formatDate(post.updatedAt)}
        </div>
        <div className="flex flex-wrap">
          {post.postTags?.map((item) => (
            <Tag key={item.id} postTag={item} className="text-sm" />
          ))}
        </div>
      </div>
    </div>
  )
}
