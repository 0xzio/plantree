import { Product, Series } from '@prisma/client'
import { atom, useAtom } from 'jotai'

export type SeriesWithProduct = Series & {
  product?: Product
}

type State = {
  isOpen: boolean
  series: SeriesWithProduct
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
