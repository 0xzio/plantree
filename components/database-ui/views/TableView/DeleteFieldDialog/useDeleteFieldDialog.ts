'use client'

import { atom, useAtom } from 'jotai'
import { Field } from '@prisma/client'

type State = {
  isOpen: boolean
  field: Field
}

const deleteFieldDialogAtom = atom<State>({
  isOpen: false,
  field: null as any,
} as State)

export function useDeleteFieldDialog() {
  const [state, setState] = useAtom(deleteFieldDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
