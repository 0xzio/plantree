'use client'

import { useState } from 'react'
import LoadingCircle from '@/components/icons/loading-circle'
import { useSiteContext } from '@/components/SiteContext'
import { useSubscriptionGuideDialog } from '@/components/SubscriptionGuideDialog/useSubscriptionGuideDialog'
import { Button } from '@/components/ui/button'
import { useDatabases } from '@/hooks/useDatabases'
import { useIsMember } from '@/hooks/useIsMember'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api } from '@/lib/trpc'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function CreatePageButton() {
  const isMember = useIsMember()
  const { setIsOpen } = useSubscriptionGuideDialog()
  const { push } = useRouter()
  const { refetch } = useDatabases()
  const [isLoading, setLoading] = useState(false)
  const site = useSiteContext()
  async function createPage() {
    if (!isMember) return setIsOpen(true)
    setLoading(true)
    try {
      const page = await api.page.create.mutate({
        siteId: site.id,
        title: '',
      })
      push(`/~/page?id=${page.id}`)
      refetch()
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to create page')
    }
    setLoading(false)
  }
  return (
    <Button
      className="w-32 flex gap-1"
      disabled={isLoading}
      onClick={createPage}
    >
      {!isLoading && <span>New Page</span>}
      {isLoading && <LoadingCircle></LoadingCircle>}
    </Button>
  )
}
