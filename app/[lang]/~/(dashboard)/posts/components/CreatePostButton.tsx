'use client'

import { useState } from 'react'
import LoadingCircle from '@/components/icons/loading-circle'
import { LoadingDots } from '@/components/icons/loading-dots'
import { AddNoteDialog } from '@/components/Post/AddNoteDialog/AddNoteDialog'
import { useAddNoteDialog } from '@/components/Post/AddNoteDialog/useAddNoteDialog'
import { useSiteContext } from '@/components/SiteContext'
import { useSubscriptionGuideDialog } from '@/components/SubscriptionGuideDialog/useSubscriptionGuideDialog'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useIsMember } from '@/hooks/useIsMember'
import { loadPost } from '@/hooks/usePost'
import { editorDefaultValue } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { useRouter } from '@/lib/i18n'
import { api } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { PostType } from '@prisma/client'
import { ChevronDown, FileText, Image, Pen, Plus, Video } from 'lucide-react'
import { toast } from 'sonner'

export function CreatePostButton() {
  const site = useSiteContext()
  const { push } = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [type, setType] = useState<PostType>('' as any)
  const [open, setOpen] = useState(false)
  const isMember = useIsMember()
  const { setIsOpen } = useSubscriptionGuideDialog()
  const addNoteDialog = useAddNoteDialog()

  async function createPost(type: PostType) {
    if (!isMember) return setIsOpen(true)

    let content = JSON.stringify(editorDefaultValue)
    if (type === PostType.IMAGE || type === PostType.VIDEO) content = ''

    setLoading(true)
    try {
      const post = await api.post.create.mutate({
        siteId: site.id,
        type,
        title: '',
        content,
      })
      await loadPost(post.id)
      push(`/~/post?id=${post.id}`)
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to create post')
    }
    setLoading(false)
  }
  return (
    <div className="flex items-center">
      <AddNoteDialog />
      <Button
        className="w-24 flex gap-1 rounded-tr-none rounded-br-none"
        disabled={isLoading}
        onClick={() => createPost(PostType.ARTICLE)}
      >
        {isLoading ? <LoadingCircle></LoadingCircle> : <Plus size={16} />}
        <span>Write</span>
      </Button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            className="w-10 flex gap-1 rounded-tl-none rounded-bl-none p-0 border-l border-background/10"
            disabled={isLoading}
            onClick={() => setOpen(true)}
          >
            <ChevronDown size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-48 p-2">
          <Item
            className="flex gap-2"
            isLoading={isLoading && type == PostType.ARTICLE}
            onClick={async () => {
              setType(PostType.ARTICLE)
              await createPost(PostType.ARTICLE)
              setIsOpen(false)
            }}
          >
            <FileText size={16} />
            <span>Article</span>
          </Item>
          <Item
            className="flex gap-2"
            isLoading={isLoading && type == PostType.NOTE}
            onClick={async () => {
              addNoteDialog.setIsOpen(true)
              setIsOpen(false)
            }}
          >
            <Pen size={16} />
            <span>Note</span>
          </Item>
          <Item
            className="flex gap-2"
            isLoading={isLoading && type == PostType.IMAGE}
            onClick={async () => {
              setType(PostType.IMAGE)
              await createPost(PostType.IMAGE)
              setIsOpen(false)
            }}
          >
            <Image size={16} />
            <span>Image</span>
          </Item>
          <Item
            className="flex gap-2"
            disabled
            onClick={async () => {
              toast.info('Coming soon...')
            }}
          >
            <Video size={16} />
            <span>Video</span>
          </Item>
        </PopoverContent>
      </Popover>
    </div>
  )
}

interface ItemProps {
  children: React.ReactNode
  disabled?: boolean
  isLoading?: boolean
  className?: string
  onClick?: () => Promise<void>
}

function Item({
  children,
  isLoading,
  onClick,
  disabled,
  className,
}: ItemProps) {
  return (
    <div
      className={cn(
        'flex items-center h-9 hover:bg-accent rounded cursor-pointer px-2 py-2 gap-2 text-sm',
        disabled && 'cursor-not-allowed opacity-40 hover:bg-none',
        className,
      )}
      onClick={() => {
        if (disabled) return
        onClick?.()
      }}
    >
      {children}
      {isLoading && <LoadingDots className="bg-foreground/60" />}
    </div>
  )
}
