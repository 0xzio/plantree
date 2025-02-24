'use client'

import { atom, useAtom } from 'jotai'

const chatSheetAtom = atom<boolean>(false)

export function useMobileSidebar() {
  const [isOpen, setIsOpen] = useAtom(chatSheetAtom)
  return { isOpen, setIsOpen }
}
