'use client'

import { useMemo } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { Post as IPost, usePost } from '@/hooks/usePost'
import { usePostSaving } from '@/hooks/usePostSaving'
import { useSiteCollaborators } from '@/hooks/useSiteCollaborators'
import { useSiteTags } from '@/hooks/useSiteTags'
import { editorDefaultValue } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import { isValidUUIDv4 } from '@/lib/utils'
import { PostType } from '@/lib/theme.types'
import { format } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { PlateEditor } from '../editor/plate-editor'
import { Separator } from '../ui/separator'
import { AddPropButton } from './AddPropButton'
import { AudioCreationUpload } from './AudioCreationUpload'
import { Authors } from './Authors'
import { CoverUpload } from './CoverUpload'
import { DeletePostDialog } from './DeletePostDialog/DeletePostDialog'
import { JournalNav } from './JournalNav'
import { PostLocales } from './PostLocales'
import { Tags } from './Tags'

export function Post() {
  const params = useSearchParams()
  const id = params?.get('id') || ''
  const { mutateAsync } = trpc.post.update.useMutation()
  const { setPostSaving } = usePostSaving()
  // console.log('post==============:', post)
  const {
    post,
    title,
    description,
    content,
    updateTitle,
    updateDescription,
    updateContent,
  } = usePost()

  useSiteTags()
  useSiteCollaborators()

  const isJournal = useMemo(() => {
    return !isValidUUIDv4(id)
  }, [id])
  const isToday = id === 'today'

  const journalTitle = useMemo(() => {
    if (!isJournal) return ''
    if (isToday) return 'Today, ' + format(new Date(Date.now()), 'LLL do')
    const formattedDate = format(new Date(id || Date.now()), 'LLL do')
    return formattedDate
  }, [isJournal, isToday, id])

  const debouncedUpdate = useDebouncedCallback(
    async (value: IPost) => {
      setPostSaving(true)
      try {
        await mutateAsync({
          id: value.id,
          title: value.title,
          content: value.content,
          description: value.description,
          i18n: value.i18n ?? {},
        })
      } catch (error) {}
      setPostSaving(false)
    },
    // delay in ms
    200,
  )

  return (
    <>
      <DeletePostDialog />
      <div className="w-full h-full">
        <div className="relative min-h-[500px] py-12 px-8 z-0">
          <div className="w-full px-16 sm:px-[max(10px,calc(50%-350px))]">
            {[PostType.ARTICLE, PostType.AUDIO].includes(post.type as any) && (
              <div className="mb-5 flex flex-col space-y-3 ">
                <CoverUpload post={post} />
                {isJournal && (
                  <div className="flex items-center gap-4">
                    <span className="text-foreground text-4xl font-bold">
                      {journalTitle}
                    </span>
                    <JournalNav date={post.date} />
                  </div>
                )}

                {!isJournal && (
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
                )}
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

            {!post.isPage && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Authors post={post} />
                  <Separator orientation="vertical" className="h-3" />
                  <div className="flex items-center gap-2">
                    <Tags />
                    {/* <PostLocales /> */}
                  </div>
                </div>

                <AddPropButton />
              </div>
            )}

            {post.type === PostType.AUDIO && (
              <div className="mt-6">
                <AudioCreationUpload post={post as any} />
              </div>
            )}
          </div>

          <div className="w-full mt-4" data-registry="plate">
            <PlateEditor
              variant="post"
              className="w-full dark:caret-brand"
              value={
                content && !content.startsWith('/')
                  ? JSON.parse(content)
                  : editorDefaultValue
              }
              showAddButton
              showFixedToolbar={false}
              onChange={(v) => {
                const newPost = updateContent(JSON.stringify(v))
                debouncedUpdate(newPost)
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
