import { PodcastTips } from '@/components/theme-ui/PodcastTips'
import { placeholderBlurhash } from '@/lib/constants'
import { Link } from '@/lib/i18n'
import { Post } from '@/lib/theme.types'
import { cn, formatDate } from '@/lib/utils'
import { MessageCircleIcon } from 'lucide-react'
import Image from 'next/image'
import { Node } from 'slate'
import { getUserName } from '../lib/getUserName'
import { AuthorAvatar } from './AuthorAvatar'

interface Props {
  post: Post
}

export default function FeaturedPost({ post }: Props) {
  const user = post.authors?.[0]?.user
  const name = getUserName(user)

  const nodes: any[] =
    typeof post.content === 'string' && post.content.length
      ? JSON.parse(post.content)
      : post.content || []
  const summary = nodes.map((node) => Node.string(node)).join('') || ''
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="flex flex-col gap-y-3 bg-background overflow-hidden drop-shadow-xs"
    >
      <div className="overflow-clip h-[400px]">
        <Image
          src={post.image || placeholderBlurhash}
          alt=""
          width={1000}
          height={1000}
          placeholder="blur"
          blurDataURL={placeholderBlurhash}
          className="object-cover w-auto h-auto hover:scale-110 transition-all aspect-16/9"
        />
      </div>

      <div className="flex flex-col justify-center gap-3 px-5 py-5 flex-1">
        <div className="space-y-2">
          <div className="flex items-center gap-1 hover:scale-105 transition-all origin-left">
            <PodcastTips post={post} />
            <h2 className="text-2xl font-bold block">{post.title}</h2>
          </div>
          <p className="text-foreground/70 hover:text-foreground transition-all hover:scale-105 line-clamp-2">
            {post.description || summary?.slice(0, 200)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <AuthorAvatar post={post} />
            <div className="font-medium">{name}</div>

            <time className="text-xs text-foreground/50 ml-2">
              {formatDate(post.updatedAt)}
            </time>
          </div>
          <div className="flex items-center gap-1 text-foreground/50">
            <MessageCircleIcon size={16} className="" />
            {post.commentCount}
          </div>
        </div>
      </div>
    </Link>
  )
}
