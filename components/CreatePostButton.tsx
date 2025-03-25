'use client'

import { useState } from 'react'
import LoadingCircle from '@/components/icons/loading-circle'
import { LoadingDots } from '@/components/icons/loading-dots'
import { usePlanListDialog } from '@/components/PlanList/usePlanListDialog'
import { AddNoteDialog } from '@/components/Post/AddNoteDialog/AddNoteDialog'
import { useAddNoteDialog } from '@/components/Post/AddNoteDialog/useAddNoteDialog'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { loadPost } from '@/hooks/usePost'
import { editorDefaultValue } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { useRouter } from '@/lib/i18n'
import { api } from '@/lib/trpc'
import { useSession } from '@/lib/useSession'
import { cn } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { PostType } from '@prisma/client'
import {
  AudioLinesIcon,
  BookAudioIcon,
  ChevronDown,
  FileText,
  Image,
  LayoutListIcon,
  LightbulbIcon,
  Link2Icon,
  Pen,
  Plus,
  User,
  Video,
} from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  from?: string
  className?: string
  seriesId?: string
  children?: React.ReactNode
  onAddCategory?: () => Promise<void>
}

export function CreatePostButton({
  className,
  seriesId,
  from = '/~/pages',
  children,
  onAddCategory,
}: Props) {
  const site = useSiteContext()
  const { push } = useRouter()
  const { session } = useSession()
  const { setIsOpen } = usePlanListDialog()
  const [isLoading, setLoading] = useState(false)
  const [type, setType] = useState<PostType>('' as any)
  const [open, setOpen] = useState(false)
  const addNoteDialog = useAddNoteDialog()

  async function createPost(type: PostType) {
    let content = JSON.stringify(editorDefaultValue)
    if (type === PostType.IMAGE) content = ''

    setLoading(true)
    try {
      const post = await api.post.create.mutate({
        seriesId: seriesId || undefined,
        siteId: site.id,
        type,
        title: '',
        content,
      })
      await loadPost(post.id)
      push(`/~/post?id=${post.id}&from=${from}`)
    } catch (error) {
      console.log('=======error:', error)

      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to create post')
    }
    setLoading(false)
  }

  return (
    <div className={cn(!children && 'flex items-center')}>
      <AddNoteDialog />
      {!children && (
        <Button
          className={cn(
            'w-20 flex gap-1 rounded-tr-none rounded-br-none px-1',
            className,
          )}
          disabled={isLoading}
          onClick={() => createPost(PostType.ARTICLE)}
        >
          {isLoading && !type ? (
            <LoadingCircle></LoadingCircle>
          ) : (
            <Plus size={16} />
          )}
          <span>Create</span>
        </Button>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {children ? (
            <div>{children}</div>
          ) : (
            <Button
              className="w-10 flex gap-1 rounded-tl-none rounded-bl-none p-0 border-l border-background/10"
              disabled={isLoading}
              onClick={() => setOpen(true)}
            >
              <ChevronDown size={20} />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent align="start" className="w-48 p-2">
          <Item
            className="flex gap-2"
            isLoading={isLoading && type == PostType.ARTICLE}
            onClick={async () => {
              setType(PostType.ARTICLE)
              await createPost(PostType.ARTICLE)
            }}
          >
            <FileText size={16} />
            <span>
              <Trans>Article</Trans>
            </span>
          </Item>
          {!seriesId && (
            <Item
              className="flex gap-2"
              isLoading={isLoading && type == PostType.NOTE}
              onClick={async () => {
                addNoteDialog.setIsOpen(true)
              }}
            >
              <Pen size={16} />
              <span>
                <Trans>Note</Trans>
              </span>
            </Item>
          )}
          {!seriesId && (
            <Item
              className="flex gap-2"
              isLoading={isLoading && type == PostType.IMAGE}
              onClick={async () => {
                setType(PostType.IMAGE)
                await createPost(PostType.IMAGE)
              }}
            >
              <Image size={16} />
              <span>
                <Trans>Image</Trans>
              </span>
            </Item>
          )}
          <Item
            className="flex gap-2"
            isLoading={isLoading && type == PostType.AUDIO}
            onClick={async () => {
              if (session?.isFree) return setIsOpen(true)
              setType(PostType.AUDIO)
              await createPost(PostType.AUDIO)
            }}
          >
            <AudioLinesIcon size={16} />
            <span>
              <Trans>Podcast</Trans>
            </span>
          </Item>
          <Separator className="my-1"></Separator>
          {seriesId && (
            <Item
              className="flex gap-2"
              onClick={async () => {
                await onAddCategory?.()
                setOpen(false)
              }}
            >
              <LayoutListIcon size={16} />
              <span>
                <Trans>Category</Trans>
              </span>
            </Item>
          )}
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
