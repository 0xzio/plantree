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
import { Ellipsis } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateEditor } from '../editor/use-create-editor'
import { useSiteContext } from '../SiteContext'
import { Button } from '../ui/button'
import { MenuItem } from '../ui/menu'

export function MoreMenu({ post }: { post: Post }) {
  const [isOpen, setIsOpen] = useState(false)
  const { copy } = useCopyToClipboard()
  const { setLang } = usePost()
  const site = useSiteContext()
  const { locales = [] } = (site.config || {}) as {
    locales: string[]
  }

  const editor = useCreateEditor({
    value: post.content ? JSON.parse(post.content) : editorDefaultValue,
  })

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
        <MenuItem
          onClick={() => {
            toast.info('Coming soon...')
          }}
        >
          Copy link
        </MenuItem>
        <MenuItem
          onClick={() => {
            const content = (editor.api as any).markdown.serialize()
            copy(content)
            toast.success('Copied to clipboard')
          }}
        >
          Copy markdown
        </MenuItem>
        <MenuItem
          onClick={() => {
            toast.info('Coming soon...')
          }}
        >
          Copy html
        </MenuItem>
      </PopoverContent>
    </Popover>
  )
}
