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
import { msg } from '@lingui/core/macro'
import { useLingui } from '@lingui/react'
import { usePathname, useRouter } from 'next/navigation'

type LOCALES = 'en' | 'ja' | 'ko' | 'fr' | 'ru' | 'zh-CN'

const languages = {
  en: msg`English`,
  ja: msg`ja`,
  ko: msg`ko`,
  fr: msg`ru`,
  'zh-CN': msg`cn`,
} as const

export function LangSwitcher() {
  const router = useRouter()
  const { i18n } = useLingui()
  const pathname = usePathname()

  const [locale, setLocale] = useState<LOCALES>(
    pathname?.split('/')[1] as LOCALES,
  )

  // disabled for DEMO - so we can demonstrate the 'pseudo' locale functionality
  // if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') {
  //   languages['pseudo'] = t`Pseudo`
  // }

  function handleChange(value: string) {
    const locale = value as LOCALES

    const pathNameWithoutLocale = pathname?.split('/')?.slice(2) ?? []
    const newPath = `/${locale}/${pathNameWithoutLocale.join('/')}`

    setLocale(locale)
    router.push(newPath)
  }

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger className="w-[100px] h-8 bg-transparent">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.keys(languages).map((locale) => {
            return (
              <SelectItem value={locale} key={locale}>
                {i18n._(languages[locale as keyof typeof languages])}
              </SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
