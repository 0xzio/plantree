'use client'

import TextareaAutosize from 'react-textarea-autosize'
import { Post as IPost, usePost } from '@/hooks/usePost'
import { usePostSaving } from '@/hooks/usePostSaving'
import { useSiteCollaborators } from '@/hooks/useSiteCollaborators'
import { useSiteTags } from '@/hooks/useSiteTags'
import { editorDefaultValue } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import { PostType } from '@prisma/client'
import { useDebouncedCallback } from 'use-debounce'
import { PlateEditor } from '../editor/plate-editor'
import { Authors } from './Authors'
import { CoverUpload } from './CoverUpload'
import { Tags } from './Tags'

export function Post({ post }: { post: IPost }) {
  const { mutateAsync } = trpc.post.update.useMutation()
  const { setPostSaving } = usePostSaving()
  // console.log('post==============:', post)
  const {
    title,
    description,
    content,
    updateTitle,
    updateDescription,
    updateContent,
  } = usePost()

  useSiteTags()
  useSiteCollaborators()

  const debouncedUpdate = useDebouncedCallback(
    async (value: IPost) => {
      setPostSaving(true)
      try {
        await mutateAsync({
          id: value.id,
          title: value.title,
          content: value.content,
          description: value.description,
          i18n: value.i18n,
        })
      } catch (error) {}
      setPostSaving(false)
    },
    // delay in ms
    200,
  )

  return (
    <div className="w-full h-full">
      <div className="relative min-h-[500px] max-w-screen-lg p-12 px-8 mx-auto z-0">
        {post.type === PostType.ARTICLE && (
          <div className="mb-5 flex flex-col space-y-3 ">
            <CoverUpload post={post} />
            <TextareaAutosize
              className="dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-foreground/40 focus:outline-none focus:ring-0 bg-transparent text-4xl font-bold"
              placeholder="Title"
              value={title || ''}
              autoFocus
              onChange={(e) => {
                const newPost = updateTitle(e.target.value)
                debouncedUpdate(newPost)
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
                const newPost = updateDescription(e.target.value)
                debouncedUpdate(newPost)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                }
              }}
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <Authors post={post} />
          <Tags />
        </div>

        <PlateEditor
          className="w-full -mx-6"
          value={content ? JSON.parse(content) : editorDefaultValue}
          showAddButton
          onChange={(v) => {
            const newPost = updateContent(JSON.stringify(v))
            debouncedUpdate(newPost)
          }}
        />
      </div>
    </div>
  )
}
