'use client'

import { useState } from 'react'
import LoadingCircle from '@/components/icons/loading-circle'
import { useSiteContext } from '@/components/SiteContext'
import { useSubscriptionGuideDialog } from '@/components/SubscriptionGuideDialog/useSubscriptionGuideDialog'
import { Button } from '@/components/ui/button'
import { useIsMember } from '@/hooks/useIsMember'
import { loadPost } from '@/hooks/usePost'
import { useSite } from '@/hooks/useSite'
import { editorDefaultValue } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api } from '@/lib/trpc'
import { PostType } from '@prisma/client'
import { Pen } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function CreatePostButton() {
  const site = useSiteContext()
  const { push } = useRouter()
  const [isLoading, setLoading] = useState(false)
  const isMember = useIsMember()
  const { setIsOpen } = useSubscriptionGuideDialog()

  async function createPost() {
    if (!isMember) return setIsOpen(true)

    setLoading(true)
    try {
      const post = await api.post.create.mutate({
        siteId: site.id,
        type: PostType.ARTICLE,
        title: '',
        content: JSON.stringify(editorDefaultValue),
      })
      await loadPost(post.id)
      push(`/~/post/${post.id}`)
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to create post')
    }
    setLoading(false)
  }
  return (
    <Button
      className="w-24 flex gap-1"
      disabled={isLoading}
      onClick={createPost}
    >
      {isLoading ? <LoadingCircle></LoadingCircle> : <Pen size={16}></Pen>}
      <span>Write</span>
    </Button>
  )
}
