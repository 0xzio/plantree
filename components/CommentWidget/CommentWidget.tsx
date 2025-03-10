'use client'

import { useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { UserAvatar } from '@/components/UserAvatar'
import { trpc } from '@/lib/trpc'
import { getUrl } from '@/lib/utils'
import { User } from '@prisma/client'
import { CommentInput } from './CommentInput'
import { CommentList } from './CommentList'

interface IParent extends Comment {
  user: User
}

interface IReply {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  userId: string
  user: User
  parent?: IParent
  parentId: string
  postId: string
}

interface Props {
  postId: string
  isInPage?: boolean
}

export function CommentWidget({ postId, isInPage = true }: Props) {
  const { refetch } = trpc.comment.listByPostId.useQuery(postId)

  const { isPending, mutateAsync: listRepliesByCommentId } =
    trpc.comment.listRepliesByCommentId.useMutation()
  const [showReplyInput, setShowReplyInput] = useState<string>('')
  const [showReplies, setShowReplies] = useState<string>('')
  const [replies, setReplies] = useState<IReply[]>([])

  const onReplies = async (
    commentId: string,
    replyCount: number,
    showReplies: string,
  ) => {
    if (!replyCount) {
      return
    }

    if (showReplies) {
      setShowReplies('')

      return
    }

    try {
      const data = await listRepliesByCommentId(commentId)
      setShowReplies(commentId)
      setReplies(data as unknown as IReply[])
    } catch (error) {
      console.error('Error fetching replies:', error)
    }
  }

  return (
    <div className="flex-col">
      <div>
        <CommentInput postId={postId} />
      </div>

      <div className="mt-6">
        <CommentList postId={postId} isInPage={isInPage} />
      </div>
    </div>
  )
}
