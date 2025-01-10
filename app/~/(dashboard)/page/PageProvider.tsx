'use client'

import { PropsWithChildren, useEffect } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { loadPage, pageAtom, usePage, usePageLoading } from '@/hooks/usePage'
import { useSearchParams } from 'next/navigation'

export function PageProvider({ children }: PropsWithChildren) {
  const params = useSearchParams()
  const id = params?.get('id')
  const { page } = usePage()
  const { isPageLoading } = usePageLoading()

  useEffect(() => {
    if (!id) return

    // if (id && store.get(pageAtom)?.id !== id) {
    // }

    loadPage(id)
  }, [id])

  if (isPageLoading || !page) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return <>{children}</>
}
