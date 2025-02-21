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
import { cn } from '@/lib/utils'
import { msg } from '@lingui/core/macro'
import { useLingui } from '@lingui/react'
import { useRouter } from 'next/navigation'

type LOCALES = 'en' | 'ja' | 'ko' | 'fr' | 'ru' | 'zh-CN'

interface LangSwitcherProps {
  className?: string
  locales?: string[]
}

export function LangSwitcher({
  className,
  locales = ['en', 'zh-CN', 'ja', 'ru'],
}: LangSwitcherProps) {
  const router = useRouter()
  const { i18n } = useLingui()
  const pathname = usePathname()

  const [locale, setLocale] = useState<LOCALES>(
    // pathname?.split('/')[1] as LOCALES,
    i18n.locale as any,
  )

  console.log('======locales:', locales)

  function handleChange(value: string) {
    const locale = value as LOCALES

    // console.log('=====pathname:', pathname, 'locale:', locale)

    // const pathNameWithoutLocale = pathname?.split('/')?.slice(2) ?? []
    const newPath = `/${locale}/${pathname}`

    setLocale(locale)
    router.push(newPath)
  }

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger
        className={cn(
          'w-auto h-auto flex border-none py-0 px-0 bg-transparent',
          className,
        )}
      >
        <SelectValue placeholder="Select a lang" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
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
