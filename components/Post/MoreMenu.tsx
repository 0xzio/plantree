'use client'

import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { Post, updatePost, usePost } from '@/hooks/usePost'
import { editorDefaultValue } from '@/lib/constants'
import { api } from '@/lib/trpc'
import { sleep } from '@/lib/utils'
import { PostType } from '@/lib/theme.types'
import { Ellipsis } from 'lucide-react'
import { toast } from 'sonner'
import { useDeletePageDialog } from '../DeletePageDialog/useDeleteDatabaseDialog'
import { useCreateEditor } from '../editor/use-create-editor'
import { useSiteContext } from '../SiteContext'
import { Button } from '../ui/button'
import { MenuItem } from '../ui/menu'
import { useDeletePostDialog } from './DeletePostDialog/useDeletePostDialog'

export function MoreMenu({ post }: { post: Post }) {
  const [isOpen, setIsOpen] = useState(false)
  const { setLang } = usePost()
  const site = useSiteContext()
  const deletePostDialog = useDeletePostDialog()
  const { locales = [] } = (site.config || {}) as {
    locales: string[]
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal>
      <PopoverTrigger asChild className="gap-0">
        <Button
          size="xs"
          variant="outline"
          className="rounded-full h-8 w-8 p-0"
          onClick={() => setIsOpen(true)}
        >
          <Ellipsis size={18} className="text-foreground/60"></Ellipsis>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" side="bottom" className="p-2 w-48">
        {post.type === PostType.ARTICLE && <CopyMarkdown post={post} />}
        <MenuItem
          onClick={() => {
            toast.info('Coming soon...')
          }}
        >
          Copy link
        </MenuItem>
        <MenuItem
          onClick={() => {
            toast.info('Coming soon...')
          }}
        >
          Copy html
        </MenuItem>

        <MenuItem
          onClick={() => {
            toast.promise(
              async () => {
                return await api.post.unpublish.mutate({
                  postId: post.id,
                })
              },
              {
                loading: 'Unpublishing...',
                success: 'Unpublished successfully!',
                error: 'Failed to unpublish',
              },
            )
            setIsOpen(false)
          }}
        >
          Unpublish
        </MenuItem>

        <MenuItem
          className="text-red-500"
          onClick={() => {
            setIsOpen(false)
            deletePostDialog.setState({
              isOpen: true,
              post,
            })
          }}
        >
          Delete
        </MenuItem>
      </PopoverContent>
    </Popover>
  )
}

function CopyMarkdown({ post }: { post: Post }) {
  const { copy } = useCopyToClipboard()
  const editor = useCreateEditor({
    value: post.content ? JSON.parse(post.content) : editorDefaultValue,
  })
  return (
    <MenuItem
      onClick={() => {
        const content = (editor.api as any).markdown.serialize()
        copy(content)
        toast.success('Copied to clipboard')
      }}
    >
      Copy markdown
    </MenuItem>
  )
}
