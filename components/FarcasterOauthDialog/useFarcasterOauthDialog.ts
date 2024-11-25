import { atom, useAtom } from 'jotai'

const farcasterOauthDialogAtom = atom<boolean>(false)

export function useFarcasterOauthDialog() {
  const [isOpen, setIsOpen] = useAtom(farcasterOauthDialogAtom)
  return { isOpen, setIsOpen }
}
