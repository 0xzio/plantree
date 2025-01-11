'use client'

import { atom, useAtom } from 'jotai'

const subscriptionDialogAtom = atom<boolean>(false)

export function useSubscriptionDialog() {
  const [isOpen, setIsOpen] = useAtom(subscriptionDialogAtom)
  return { isOpen, setIsOpen }
}
