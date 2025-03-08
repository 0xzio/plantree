import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  address: string
}

const addressDialogAtom = atom<State>({
  isOpen: false,
  address: '',
} as State)

export function useInputAddressDialog() {
  const [state, setState] = useAtom(addressDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
