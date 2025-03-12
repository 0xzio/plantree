'use client'

import { atom, useAtom } from 'jotai'

const themeNameAtom = atom<{
  themeName: string
  isLoading: boolean
}>({
  themeName: '',
  isLoading: false,
})

export function useThemeName() {
  const [state, setState] = useAtom(themeNameAtom)
  return {
    ...state,
    setThemeName: (name: string) => {
      setState({ ...state, themeName: name })
    },
    setState,
  }
}
