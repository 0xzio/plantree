'use client'

import { editorDefaultValue, PostStatus } from '@/lib/constants'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { api, trpc } from '@/lib/trpc'
import { isValidUUIDv4 } from '@/lib/utils'
import { RouterOutputs } from '@/server/_app'
import { store } from '@/store'
import { PostTag, Tag } from '@prisma/client'
import { format } from 'date-fns'
import { produce } from 'immer'
import { atom, useAtom } from 'jotai'
import { postLoadingAtom } from './usePostLoading'

export type Post = RouterOutputs['post']['byId'] & {
  lang?: string
  i18n: any
}

export type PostTagWithTag = PostTag & { tag: Tag }

export const postAtom = atom<Post>(null as any as Post)

export function usePost() {
  const [post, setPost] = useAtom(postAtom)

  function setLang(lang: string) {
    store.set(postLoadingAtom, true)
    setTimeout(() => {
      store.set(postLoadingAtom, false)
      const newPost = produce(post, (draft) => {
        if (!lang) {
          draft.lang = ''
          return
        }
        draft.lang = lang
        if (!draft.i18n) draft.i18n = {}
        if (!draft.i18n?.[lang]) {
          draft.i18n[lang] = {
            title: '',
            description: '',
            content: JSON.stringify(editorDefaultValue),
          }
        }
      })

      setPost(newPost)
    }, 10)
  }

  function updateTitle(value: string) {
    const newPost = produce(post, (draft) => {
      if (!post.lang) {
        draft.title = value
      } else {
        draft.i18n[post.lang].title = value
      }
    })

    setPost(newPost)
    return newPost
  }

  function updateDescription(value: string) {
    const newPost = produce(post, (draft) => {
      if (!post.lang) {
        draft.description = value
      } else {
        draft.i18n[post.lang].description = value
      }
    })

    setPost(newPost)
    return newPost
  }

  function updateContent(value: string) {
    const newPost = produce(post, (draft) => {
      if (!post.lang) {
        draft.content = value
      } else {
        draft.i18n[post.lang].content = value
      }
    })

    setPost(newPost)
    return newPost
  }

  function getTitle() {
    if (!post?.lang) return post?.title || ''
    if (!post?.i18n) return ''
    return post.i18n?.[post.lang]?.title
  }

  function getDescription() {
    if (!post?.lang) return post?.description || ''
    if (!post?.i18n) return ''
    return post.i18n?.[post.lang]?.description
  }

  function getContent() {
    if (!post?.lang) return post?.content
    if (!post?.i18n) return
    return post.i18n?.[post.lang]?.content
  }

  return {
    post,
    title: getTitle(),
    description: getDescription(),
    content: getContent(),
    setPost,
    setLang,
    updateTitle,
    updateDescription,
    updateContent,
  }
}

export function updatePostPublishStatus() {
  const post = store.get(postAtom)
  store.set(postAtom, {
    ...post,
    status: PostStatus.PUBLISHED,
    publishedAt: new Date(),
  })
}

export function addPostTag(postTag: PostTagWithTag) {
  const post = store.get(postAtom)
  store.set(postAtom, {
    ...post,
    postTags: [...post.postTags, postTag as any],
  })
}

export function removePostTag(postTag: PostTagWithTag) {
  const post = store.get(postAtom)
  const newTags = post.postTags.filter((tag) => tag.id !== postTag.id)
  store.set(postAtom, {
    ...post,
    postTags: newTags,
  })
}

export async function loadPost(id: string) {
  store.set(postLoadingAtom, true)

  if (isValidUUIDv4(id)) {
    const post = await api.post.byId.query(id)
    store.set(postAtom, post)
    store.set(postLoadingAtom, false)
  } else {
    const date = id === 'today' ? format(new Date(), 'yyyy-MM-dd') : id
    const post = await api.page.getPage.query({
      date,
      siteId: window.__SITE_ID__,
    })
    store.set(postAtom, post)
    store.set(postLoadingAtom, false)
  }
}

export async function loadPostBySlug(slug: string) {
  store.set(postLoadingAtom, true)
  const post = await api.post.bySlug.query(slug)
  store.set(postAtom, post as any)
  store.set(postLoadingAtom, false)
}

export function updatePost(data: Partial<Post>) {
  const post = store.get(postAtom)
  store.set(postAtom, {
    ...post,
    ...data,
  })
}
