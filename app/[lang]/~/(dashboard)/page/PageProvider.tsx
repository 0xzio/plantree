'use client'

import { PropsWithChildren, useEffect } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { loadPage, pageAtom, usePage, usePageLoading } from '@/hooks/usePage'
import { isValidUUIDv4 } from '@/lib/utils'
import { format } from 'date-fns'
import { useSearchParams } from 'next/navigation'

export function PageProvider({ children }: PropsWithChildren) {
  const params = useSearchParams()
  const id = params?.get('id')
  const { page } = usePage()
  const { isPageLoading } = usePageLoading()
  const site = useSiteContext()
  const { id: siteId } = site

  useEffect(() => {
    if (!id || !siteId) return

    // if (id && store.get(pageAtom)?.id !== id) {
    // }

    // console.log('=======id:', id)
    if (!isValidUUIDv4(id)) {
      const date = id === 'today' ? format(new Date(), 'yyyy-MM-dd') : id
      loadPage({ siteId, date: date })
    } else {
      loadPage({ siteId, pageId: id })
    }
  }, [id, siteId])

  if (isPageLoading || !page) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return <>{children}</>
}
