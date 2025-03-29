'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { Post } from '@/lib/theme.types'

interface Props {
  posts: Post[]
  backLinkPosts: Post[]
}

export const PostListContext = createContext({} as Props)

export const PostListProvider = ({
  posts,
  backLinkPosts,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <PostListContext.Provider
      value={{
        posts,
        backLinkPosts,
      }}
    >
      {children}
    </PostListContext.Provider>
  )
}

export function usePostListContext() {
  return useContext(PostListContext)
}
