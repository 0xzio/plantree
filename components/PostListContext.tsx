'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { Post } from '@/lib/theme.types'

export const PostListContext = createContext({} as Post[])

interface Props {
  posts: Post[]
}

export const PostListProvider = ({
  posts,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <PostListContext.Provider value={posts}>
      {children}
    </PostListContext.Provider>
  )
}

export function usePostListContext() {
  const posts = useContext(PostListContext)
  return posts
}
