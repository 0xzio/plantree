import { Post } from '@/lib/theme.types'
import { cn, convertSecondsToTime } from '@/lib/utils'
import { PostType } from '@/lib/theme.types'
import { ExternalLink, PodcastIcon } from 'lucide-react'

interface Props {
  className?: string
  post: Post
}

export function PodcastTips({ post, className }: Props) {
  if (post.type !== PostType.AUDIO) return null

  return (
    <div className="flex items-center gap-1">
      <PodcastIcon size={16} className="" />
      {post?.podcast?.duration && (
        <div className="text-xs border border-foreground/10  rounded-full px-1 py-0.5 font-medium">
          {convertSecondsToTime(post.podcast.duration)}
        </div>
      )}
    </div>
  )
}
