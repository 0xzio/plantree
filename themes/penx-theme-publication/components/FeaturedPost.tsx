import { PostActions } from '@/components/PostActions/PostActions'
import { Post } from '@penxio/types'
import { cn, formatDate } from '@penxio/utils'
import Image from 'next/image'

interface Props {
  post: Post
}

export default function FeaturedPost({ post }: Props) {
  return (
    <div className="flex flex-col gap-y-2 mt-2">
      <Image
        src={post.image || ''}
        className="w-full h-full transition-all"
        width={1000}
        height={1000}
        alt=""
      />
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-bold text-2xl">{post.title}</h2>
        <time className="text-sm text-foreground/50">
          {formatDate(post.updatedAt)}
        </time>
      </div>
      <PostActions post={post} receivers={[]} />
    </div>
  )
}
