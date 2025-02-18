'use client'

import { useEffect, useRef } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePosts } from '@/hooks/usePosts'
import { useSite } from '@/hooks/useSite'
import { CatalogueTree } from '@/lib/catalogue'
import { ca } from 'date-fns/locale'
import { CatalogueBox } from './CatalogueBox/CatalogueBox'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, error } = useSite()
  const posts = usePosts()

  if (isLoading || posts.isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return (
    <div className="border border-foreground/10 rounded-lg w-full px-1 mx-auto">
      <CatalogueBox />
    </div>
  )
}
