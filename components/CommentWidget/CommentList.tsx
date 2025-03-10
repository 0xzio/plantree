'use client'

import { useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { UserAvatar } from '@/components/UserAvatar'
import { trpc } from '@/lib/trpc'
import { useSession } from '@/lib/useSession'
import { getUrl } from '@/lib/utils'
import { Comment, User } from '@prisma/client'
import { ArrowRight, EllipsisIcon, MessageCircle, Trash2 } from 'lucide-react'
import { CommentInput } from './CommentInput'

interface IParent extends Comment {
  user: User
}

interface Props {
  postId: string
  isInPage: boolean
}

export function CommentList({ postId, isInPage }: Props) {
  const {
    data: comments = [],
    isLoading,
    refetch,
  } = trpc.comment.listByPostId.useQuery(postId)

  const { isPending, mutateAsync: listRepliesByCommentId } =
    trpc.comment.listRepliesByCommentId.useMutation()
  const [showReplyInput, setShowReplyInput] = useState<string>('')
  const [showReplies, setShowReplies] = useState<string>('')
  const { session } = useSession()

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
    } catch (error) {
      console.error('Error fetching replies:', error)
    }
  }

  const getParentUser = (comment: Comment) => {
    return comments.find((item) => item.id === comment.parentId)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-10">
        <LoadingDots className="bg-foreground" />
      </div>
    )
  }

  if (!comments.length) {
    return (
      <div className="">
        <p className="text-foreground/40">No comments yet.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment, index) => {
        const avatarJSX = (
          <UserAvatar
            address={comment.user.email as string}
            image={getUrl(comment.user.image || '')}
            className="h-8 w-8"
          />
        )

        const contentJSX = <div className="text-[15px]">{comment.content}</div>

        const authorJSX = (
          <div className="flex items-center gap-1">
            <div className="text-sm font-bold">{comment.user?.displayName}</div>

            {!!comment.parentId && (
              <>
                <ArrowRight size={12} className="text-foreground/40" />
                <div className="text-sm font-bold">
                  {getParentUser(comment)?.user?.displayName}
                </div>
              </>
            )}
          </div>
        )

        const timeJSX = (
          <div className="text-xs text-foreground/50">
            {comment.createdAt.toLocaleDateString()}
          </div>
        )

        return (
          <div
            key={comment.id}
            className="my-2 bg-background rounded group space-y-2"
          >
            <div className="flex items-center gap-2 text-foreground/80">
              {avatarJSX}
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {authorJSX}
                    {timeJSX}
                  </div>
                  <div className="hidden transition-all group-hover:flex items-center gap-1 text-foreground/50">
                    <MessageCircle
                      size={16}
                      className="hover:text-foreground/70 cursor-pointer"
                      onClick={() =>
                        setShowReplyInput(showReplyInput ? '' : comment.id)
                      }
                    />
                  </div>
                </div>
                {contentJSX}
              </div>
            </div>

            {showReplyInput === comment.id && (
              <CommentInput
                postId={comment.postId}
                parentId={comment.id}
                onCancel={() => {
                  setShowReplyInput('')
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
