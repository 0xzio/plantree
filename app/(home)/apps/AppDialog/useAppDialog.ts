import { App } from '@/lib/types'
import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  app: App
}

const appDialogAtom = atom<State>({
  isOpen: false,
  app: null as any,
} as State)

export function useAppDialog() {
  const [state, setState] = useAtom(appDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
