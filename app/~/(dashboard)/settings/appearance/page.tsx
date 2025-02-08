'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSite } from '@/hooks/useSite'
import { trpc } from '@/lib/trpc'
import { NavList } from './NavList'
import { ThemeSettingForm } from './ThemeSettingForm'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, site, error } = useSite()

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Theme settings</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeSettingForm site={site!} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Navigation bar links</CardTitle>
        </CardHeader>
        <CardContent>
          <NavList site={site} />
        </CardContent>
      </Card>
    </div>
  )
}
