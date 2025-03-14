'use client'

import { useState } from 'react'
import { PlateEditor } from '@/components/editor/plate-editor'
import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { editorDefaultValue } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { Site } from '@/lib/theme.types'
import { api, trpc } from '@/lib/trpc'
import { useSession } from '@/lib/useSession'
import { PostStatus, PostType, Tier } from '@prisma/client'
import { TextareaAutosize } from '@udecode/plate-caption/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

interface Props {
  site: Site
  tiers: Tier[]
}

export function ContributeBox({ site }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const { isPending, mutateAsync } = trpc.post.create.useMutation()
  const { session } = useSession()
  const { push } = useRouter()
  const search = useSearchParams()!
  const source = search.get('source') || '/'

  async function submitPost() {
    console.log('ghgo....x')

    if (!title) {
      toast.info('Title is required')
      return
    }

    try {
      window.__SITE_ID__ = site.id
      await mutateAsync({
        siteId: site.id,
        title,
        description,
        type: PostType.ARTICLE,
        content,
        status: PostStatus.CONTRIBUTED,
        userId: session?.userId || '',
      })
      toast.success('Your post has been submitted for review')
      push(source)
    } catch (error) {
      console.log('====error:', error)

      toast.error(extractErrorMessage(error))
    }
  }
  return (
    <div className="">
      <div className="w-full px-16 sm:px-[max(10px,calc(50%-350px))]">
        <TextareaAutosize
          className="dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-foreground/40 focus:outline-none focus:ring-0 bg-transparent text-4xl font-bold"
          placeholder="Title"
          value={title}
          autoFocus
          onChange={(e) => {
            setTitle(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
            }
          }}
        />

        <TextareaAutosize
          className="dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-stone-400 focus:outline-none focus:ring-0 bg-transparent"
          placeholder="Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
            }
          }}
        />
      </div>

      <PlateEditor
        variant="post"
        className="w-full dark:caret-brand"
        value={editorDefaultValue}
        showAddButton
        showFixedToolbar
        onChange={(v) => {
          setContent(JSON.stringify(v))
        }}
      />
      <div className="fixed bottom-0 pb-4 flex flex-col items-center justify-center w-full left-0 gap-1">
        <Button
          size="lg"
          variant="outline-solid"
          // variant="brand"
          disabled={isPending}
          className="w-36 text-lg font-bold h-12 rounded-full shadow-xl"
          onClick={() => {
            submitPost()
          }}
        >
          {isPending ? (
            <LoadingDots className="bg-foreground" />
          ) : (
            'Submit post'
          )}
        </Button>
        <div className="text-sm text-foreground/50">
          After the post is submitted, the owner will review it.
        </div>
      </div>
    </div>
  )
}
