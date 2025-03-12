'use client'

import { useEffect } from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { Design } from './Design'
import { useThemeName } from './hooks/useThemeName'
import { ThemeList } from './ThemeList'

// export const runtime = 'edge'
// export const dynamic = 'force-static'

export default function Page() {
  const site = useSiteContext()
  const { themeName, setThemeName } = useThemeName()

  useEffect(() => {
    setThemeName(site.themeName || 'sue')
  }, [])

  if (!themeName) return null

  return (
    <div className="flex gap-10">
      <ThemeList />
      <Design />
    </div>
  )
}
