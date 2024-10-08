'use client'

import { PropsWithChildren } from 'react'
import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { useQueryEthPrice } from '@/hooks/useEthPrice'
import { useQuerySpace, useSpace } from '@/hooks/useSpace'
import { CreateSpaceDialog } from '../CreateSpaceDialog/CreateSpaceDialog'
import LoadingDots from '../icons/loading-dots'

export function DashboardLayout({ children }: PropsWithChildren) {
  useQueryEthPrice()
  useQueryEthBalance()
  useQuerySpace()
  const { space } = useSpace()

  if (!space?.address) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <LoadingDots />
      </div>
    )
  }

  return (
    <div className="mx-auto pb-20">
      <div className="min-h-screen flex-row justify-center flex relative">
        <CreateSpaceDialog />
        <div
          className="flex-1 overflow-x-hidden z-1"
          style={
            {
              // boxShadow: '-10px 0px 15px -5px rgba(0, 0, 0, 0.5)',
            }
          }
        >
          {children}
        </div>
      </div>
    </div>
  )
}
