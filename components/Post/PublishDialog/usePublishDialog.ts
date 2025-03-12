import { Post } from '@prisma/client'
import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  post: Post
}

const priceDialogAtom = atom<State>({
  isOpen: false,
  post: null as any,
} as State)

export function usePublishDialog() {
  const [state, setState] = useAtom(priceDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
