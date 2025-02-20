'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { usePages } from '@/hooks/usePages'
import { usePosts } from '@/hooks/usePosts'
import { useSite } from '@/hooks/useSite'
import { CatalogueBox } from './CatalogueBox/CatalogueBox'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, error } = useSite()
  const posts = usePosts()
  const pages = usePages()

  if (isLoading || posts.isLoading || pages.isLoading) {
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
