import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from '@/lib/i18n'
import { Post } from '@/lib/theme.types'
import { cn, formatDate, getUrl } from '@/lib/utils'
import Image from 'next/image'
import Tag from './Tag'

interface Props {
  post: Post
}

export function FeatureBox({ post }: Props) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className={cn('w-full items-center gap-10 grid grid-cols-3')}
    >
      <div className="overflow-clip rounded-2xl h-80 col-span-2">
        <Image
          src={post.image || ''}
          alt=""
          width={800}
          height={800}
          className="object-cover w-auto h-auto hover:scale-110 transition-all aspect-16/9"
        />
      </div>

      <div className="space-y-4 w-80 col-span-1">
        <div>
          <div className="flex items-center text-sm gap-3">
            <div className="text-foreground/50">
              {formatDate(post.updatedAt)}
            </div>
            <div className="flex flex-wrap">
              {post.postTags?.map((item) => (
                <Tag key={item.id} postTag={item} className="text-sm" />
              ))}
            </div>
          </div>
          <h2 className="text-2xl font-bold leading-8 tracking-tight">
            {post.title}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <Avatar>
            <AvatarImage src={getUrl(post.user.image || '')} />
            <AvatarFallback>{post.user.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">
              {post.user.displayName || post.user.name}
            </div>
            <div>{post.description}</div>
          </div>
        </div>
      </div>
    </Link>
  )
}
