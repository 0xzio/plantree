'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { Space } from '@/domains/Space'
import { useQueryEthPrice } from '@/hooks/useEthPrice'
import { SpaceType } from '@/lib/types'

export const SpaceContext = createContext({} as Space)

interface Props {
  space: SpaceType
}

export const SpaceProvider = ({
  space,
  children,
}: PropsWithChildren<Props>) => {
  useQueryEthPrice()
  return (
    <SpaceContext.Provider value={new Space(space)}>
      {children}
    </SpaceContext.Provider>
  )
}

export function useSpaceContext() {
  return useContext(SpaceContext)
}
