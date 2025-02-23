'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePathname } from '@/lib/i18n'
import { langMap } from '@/lib/supportLanguages'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { useLingui } from '@lingui/react'
import { useRouter } from 'next/navigation'

type LOCALES = 'en' | 'ja' | 'ko' | 'fr' | 'ru' | 'zh-CN'

interface LangSwitcherProps {
  className?: string
  site: Site
}

export function LangSwitcher({ className, site }: LangSwitcherProps) {
  const router = useRouter()
  const { i18n } = useLingui()
  const pathname = usePathname()

  const [locale, setLocale] = useState<LOCALES>(
    // pathname?.split('/')[1] as LOCALES,
    i18n.locale as any,
  )
  const { locales = [] } = site.config || {}

  if (!locales.length) return null

  function handleChange(value: string) {
    const locale = value as LOCALES

    const newPath =
      value === 'default' ? `${pathname}` : `/${locale}${pathname}`

    setLocale(locale)
    router.push(newPath)
  }

  if (!locale) return null

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger
        className={cn(
          'w-auto h-auto flex border-none py-0 px-0 bg-transparent text-foreground/60',
          className,
        )}
      >
        <SelectValue placeholder="Select a lang" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={'default'}>Default</SelectItem>
          {locales.map((locale) => {
            return (
              <SelectItem value={locale} key={locale}>
                {langMap.get(locale) || locale}
              </SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
