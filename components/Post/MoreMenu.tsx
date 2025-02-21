'use client'

import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Post, updatePost, usePost } from '@/hooks/usePost'
import { langMap } from '@/lib/supportLanguages'
import { Ellipsis } from 'lucide-react'
import { toast } from 'sonner'
import { useSiteContext } from '../SiteContext'
import { Button } from '../ui/button'
import { Menu, MenuItem } from '../ui/menu'
import { Separator } from '../ui/separator'

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

        {locales.length > 0 && (
          <>
            <Separator className="my-1 -mr-2"></Separator>
            <MenuItem
              onClick={() => {
                setLang('')
                setIsOpen(false)
              }}
            >
              Default language
            </MenuItem>
          </>
        )}

        {locales.map((locale) => (
          <MenuItem
            key={locale}
            onClick={() => {
              setLang(locale)
              setIsOpen(false)
            }}
          >
            {langMap.get(locale) || locale}
          </MenuItem>
        ))}
      </PopoverContent>
    </Popover>
  )
}
