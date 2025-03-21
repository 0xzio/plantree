'use client'

import { Post } from '@prisma/client'
import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  post: Post
}

const deletePostDialogAtom = atom<State>({
  isOpen: false,
  post: null as any,
} as State)

export function useDeletePostDialog() {
  const [state, setState] = useAtom(deletePostDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
