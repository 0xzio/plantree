'use client'

import { useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { Post } from '@/hooks/usePost'
import { trpc } from '@/lib/trpc'
import { useDebouncedCallback } from 'use-debounce'
import { ProfileAvatar } from '../Profile/ProfileAvatar'
import { ImageCreationUpload } from './ImageCreationUpload'

export function ImageCreation({ post }: { post: Post }) {
  const [data, setData] = useState<Post>(post)
  const { isPending, mutateAsync } = trpc.post.update.useMutation()

  const debounced = useDebouncedCallback(
    async (value: Post) => {
      if (data.content !== post.content || data.title !== post.title) {
        try {
          await mutateAsync({
            id: post.id,
            title: value.title,
            content: value.content as any,
            description: value.description,
          })
        } catch (error) {}
      }
    },
    // delay in ms
    400,
  )

  useEffect(() => {
    debounced(data)
  }, [data, debounced])

  return (
    <div className="w-full">
      <div className="relative min-h-[500px] max-w-screen-lg p-12 px-8 mx-auto z-0 md:w-[800px] sm:w-full">
        <div className="mb-5 flex flex-col space-y-3 pb-5">
          <TextareaAutosize
            className="dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-foreground/40 focus:outline-none focus:ring-0 bg-transparent text-4xl font-bold"
            placeholder="Title"
            defaultValue={data?.title || ''}
            autoFocus
            onChange={(e) => {
              setData({ ...data, title: e.target.value })
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
            defaultValue={post?.description || ''}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
              }
            }}
          />
        </div>
        <div className="mb-8">{/* <ProfileAvatar showName /> */}</div>

        <ImageCreationUpload post={data} />
      </div>
    </div>
  )
}
