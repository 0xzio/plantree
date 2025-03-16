import { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useLoginDialog } from '@/components/LoginDialog/useLoginDialog'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc'
import { useSession } from '@/lib/useSession'
import { SendIcon } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

const CommentSchema = z.object({
  content: z
    .string()
    .min(1, { message: 'Comment cannot be empty.' })
    .max(1000, { message: 'Comment cannot exceed 1000 characters.' }),
})

interface Props {
  postId: string
  // For reply
  parentId?: string
  onCancel?: () => void
}

const maxCharacters = 1000

export function CommentInput({ postId, parentId, onCancel }: Props) {
  const site = useSiteContext()
  const { refetch } = trpc.comment.listByPostId.useQuery(postId)
  const [content, setContent] = useState('')
  const { isPending, mutateAsync } = trpc.comment.create.useMutation()
  const loginDialog = useLoginDialog()
  const { data: session } = useSession()
  const authenticated = !!session

  async function handleSubmit() {
    const result = CommentSchema.safeParse({ content })
    if (!result.success) {
      toast.error(result.error.issues[0].message)
      return
    }

    if (!authenticated) {
      toast.error('You need to log in to comment.')

      return
    }

    try {
      await mutateAsync({
        siteId: site.id,
        postId,
        content,
        parentId,
      })

      setContent('')
      onCancel && onCancel()
      refetch()
      toast.success('Comment submitted successfully!')
    } catch (error) {
      console.log('Failed to submit comment.', 'color:red', error)
      toast.error('Failed to submit comment.')
    }
  }

  return (
    <div className="relative">
      <TextareaAutosize
        placeholder="Write something here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={maxCharacters}
        className="w-full min-h-28 pt-4 px-4 pb-8 border border-foreground/15 rounded-xl resize-none"
      />
      <div className="flex items-center justify-between text-sm mt-2 text-foreground/50 absolute bottom-3 px-2 w-full">
        <div className="text-xs -mb-3 pl-1">
          {content.length}/{maxCharacters}
        </div>

        <div className="flex justify-end gap-1">
          {parentId && (
            <Button
              variant="ghost"
              size="xs"
              className="w-16 text-xs rounded-lg h-8"
              onClick={() => {
                setContent('')
                onCancel && onCancel()
              }}
            >
              <p>Cancel</p>
            </Button>
          )}

          {!authenticated ? (
            <Button
              size="xs"
              className="w-16 text-xs rounded-lg h-8"
              onClick={() => {
                loginDialog.setIsOpen(true)
              }}
            >
              Login
            </Button>
          ) : (
            <Button
              size="xs"
              onClick={handleSubmit}
              className="w-16 text-xs rounded-lg h-8"
            >
              {isPending ? (
                <LoadingDots />
              ) : (
                <>
                  <SendIcon size={14} />
                  <span>Send</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
