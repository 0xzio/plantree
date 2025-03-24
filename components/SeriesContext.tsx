'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { RouterOutputs } from '@/server/_app'

export type SeriesItem = RouterOutputs['series']['getSeriesById']
export const SeriesContext = createContext({} as SeriesItem)

interface Props {
  series: SeriesItem
}

export const SeriesProvider = ({
  series,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <SeriesContext.Provider value={series}>{children}</SeriesContext.Provider>
  )
}

export function useSeriesContext() {
  return useContext(SeriesContext)
}
