'use client'

import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Post, updatePost, usePost } from '@/hooks/usePost'
import { Ellipsis } from 'lucide-react'
import { useSiteContext } from '../SiteContext'
import { Button } from '../ui/button'
import { MenuItem } from '../ui/menu'

export function MoreMenu({ post }: { post: Post }) {
  const [isOpen, setIsOpen] = useState(false)
  const { setLang } = usePost()
  const site = useSiteContext()
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
        <MenuItem>Copy link</MenuItem>
        <MenuItem>Copy markdown</MenuItem>
        <MenuItem>Copy html</MenuItem>
      </PopoverContent>
    </Popover>
  )
}
