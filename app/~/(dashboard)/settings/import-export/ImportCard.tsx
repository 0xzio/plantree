'use client'

import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ImportPostsButton } from './ImportPostsButton'

function ImportSubscribers() {
  const site = useSiteContext()
  const { isPending, mutateAsync: exportPosts } = useMutation({
    mutationKey: ['export-subscribers'],
    mutationFn: async () => {
      toast.success('Subscribers exported successfully!')
    },
  })

  return (
    <div className="flex items-center justify-between">
      <div className="font-semibold">Subscribers</div>
      <Button
        disabled={isPending}
        onClick={() => {
          toast.info('Coming soon! This feature is not yet available.')
        }}
      >
        Import
      </Button>
    </div>
  )
}

function ImportPosts() {
  return (
    <div className="flex items-center justify-between">
      <div className="font-semibold">Posts</div>
      <ImportPostsButton />
    </div>
  )
}

export function ImportCard() {
  return (
    <div>
      <h2 className="text-2xl font-semibold">Import</h2>
      <div className="text-foreground/60 mb-4">
        Export your data: subscribers, posts. everything else.
      </div>
      <div className="space-y-1">
        <ImportPosts />
        <ImportSubscribers />
      </div>
    </div>
  )
}
