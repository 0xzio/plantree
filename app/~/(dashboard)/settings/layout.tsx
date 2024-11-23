'use client'

import { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { useSite } from '@/hooks/useSite'
import { ExternalLink } from 'lucide-react'
import { SettingNav } from './SettingNav'

export const dynamic = 'force-static'

export default function Layout({ children }: { children: ReactNode }) {
  const { site } = useSite()
  const link = `${site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <div className="text-3xl font-bold">Settings</div>
        <a href={`${location.protocol}//${link}`} target="_blank">
          <Badge variant="secondary" className="space-x-2">
            <span>{link}</span>
            <ExternalLink size={16} className="text-foreground/50" />
          </Badge>
        </a>
      </div>
      <SettingNav />
      {children}
    </div>
  )
}
