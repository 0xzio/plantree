'use client'

import { useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { usePages } from '@/hooks/usePages'
import { usePosts } from '@/hooks/usePosts'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { localDB } from '@/lib/local-db'
import { api } from '@/lib/trpc'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useDeletePostDialog } from './useDeletePostDialog'

interface Props {}

export function DeletePostDialog({}: Props) {
  const { isOpen, setIsOpen, post } = useDeletePostDialog()
  const [loading, setLoading] = useState(false)
  const { refetch: refetchPages } = usePages()
  const { refetch: refetchPosts } = usePosts()
  const { push } = useRouter()

  async function deletePost() {
    setLoading(true)
    try {
      await api.post.delete.mutate(post.id)
      toast.success('Deleted successfully')
      if (post.isPage) {
        await refetchPages()
      } else {
        await refetchPosts()
      }
      setIsOpen(false)
      push(`/~/posts`)
    } catch (error) {
      toast.error(extractErrorMessage(error) || 'Failed to delete')
    }
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent closable={false} className="">
        <DialogHeader className="">
          <DialogTitle className="">
            Are you sure delete it permanently?
          </DialogTitle>
          <DialogDescription>
            Once deleted, You can't undo this action.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row gap-2">
          <DialogClose asChild>
            <Button className="w-20" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="w-20"
            disabled={loading}
            variant="destructive"
            onClick={deletePost}
          >
            {loading ? <LoadingDots className="bg-background" /> : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
