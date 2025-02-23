'use client'

import { PropsWithChildren, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { usePost } from '@/hooks/usePost'
import { langMap } from '@/lib/supportLanguages'
import { ChevronDown, Languages } from 'lucide-react'
import { useSiteContext } from '../SiteContext'

export function PostLocales() {
  const { setLang, post } = usePost()
  const site = useSiteContext()
  const { locales = [] } = (site.config || {}) as {
    locales: string[]
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-1 border border-foreground/10 h-7 px-2 rounded-lg text-sm cursor-pointer">
            {(post.lang === '' || post.lang === 'default') && (
              <Languages className="mr-1" size={16} />
            )}
            <span>{langMap.get(post.lang!) || 'Default'}</span>
            <ChevronDown size={14} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuRadioGroup
            value={post.lang || ''}
            onValueChange={(v) => {
              setLang(v)
            }}
          >
            <DropdownMenuRadioItem value="">Default</DropdownMenuRadioItem>

            {locales.map((locale) => (
              <DropdownMenuRadioItem key={locale} value={locale}>
                {langMap.get(locale) || locale}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
