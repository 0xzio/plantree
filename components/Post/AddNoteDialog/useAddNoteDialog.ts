import { atom, useAtom } from 'jotai'

const addNoteDialogAtom = atom<boolean>(false)

export function useAddNoteDialog() {
  const [isOpen, setIsOpen] = useAtom(addNoteDialogAtom)
  return { isOpen, setIsOpen }
}
