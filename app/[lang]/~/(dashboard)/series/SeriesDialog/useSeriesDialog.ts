import { Series, Tier } from '@prisma/client'
import { atom, useAtom } from 'jotai'

type State = {
  isOpen: boolean
  series: Series
}

const seriesDialogAtom = atom<State>({
  isOpen: false,
  series: null as any,
} as State)

export function useSeriesDialog() {
  const [state, setState] = useAtom(seriesDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}
