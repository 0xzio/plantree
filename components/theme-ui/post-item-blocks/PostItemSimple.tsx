import { PlateEditor } from '@/components/editor/plate-editor'
import { Link } from '@/lib/i18n'
import { Post, PostListStyle, PostType } from '@/lib/theme.types'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'
import { PodcastTips } from '../PodcastTips'
import Tag from './Tag'

interface Props {
  post: Post
}

export function PostItemSimple({ post }: Props) {
  const { slug, title } = post

  const getContent = () => {
    if (post.type === PostType.IMAGE) {
      return (
        <div className="flex items-center gap-2">
          <div className="text-base font-bold">{post.title || 'Untitled'}</div>
          <Image
            src={post.content}
            alt=""
            width={100}
            height={100}
            className="w-10 h-10 rounded-lg"
          />
        </div>
      )
    }

    if (post.type === PostType.NOTE) {
      return (
        <div className="text-foreground/80">
          <PlateEditor
            value={JSON.parse(post.content)}
            readonly
            className="px-0 py-0"
          />
        </div>
      )
    }

    return (
      <div className="flex items-center gap-1 hover:scale-105 transition-all">
        <PodcastTips post={post} />
        <div className="text-lg ">{title}</div>
      </div>
    )
  }

  return (
    <div>
      <Link
        key={slug}
        href={`/posts/${slug}`}
        className="hover:text-foreground flex items-center justify-between gap-6 text-foreground/80"
      >
        {getContent()}
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
