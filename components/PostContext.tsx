'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { Post } from '@/lib/theme.types'

export const PostContext = createContext({} as Post)

interface Props {
  post: Post
}

export const PostProvider = ({ post, children }: PropsWithChildren<Props>) => {
  return <PostContext.Provider value={post}>{children}</PostContext.Provider>
}

export function usePostContext() {
  const post = useContext(PostContext)
  return post
}
