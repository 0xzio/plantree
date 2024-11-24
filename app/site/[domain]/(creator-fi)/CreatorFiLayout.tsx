'use client'

import { PropsWithChildren } from 'react'
import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { useQueryEthPrice } from '@/hooks/useEthPrice'
import { SpaceType } from '@/lib/types'
import { SpaceHeader } from './Space/SpaceHeader'
import { SpaceInfo } from './Space/SpaceInfo'
import { Transaction } from './Space/Transaction'

interface Props {}

export function CreatorFiLayout({ children }: PropsWithChildren<Props>) {
  useQueryEthBalance()
  useQueryEthPrice()

  return (
    <div>
      <SpaceHeader />
      <div className="flex lg:flex-row flex-col-reverse w-full sm:w-full mx-auto gap-12 mt-10 p-3 lg:p-0 md:max-w-5xl lg:max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-1 rounded-2xl w-full md:w-auto">
          <SpaceInfo />
          {children}
        </div>

        <div className="flex flex-col w-full lg:w-[360px] flex-shrink-0">
          <Transaction />
          <div className="mt-8 lg:block">
            {/* <Tabs
              className="w-full"
              value={type}
              onValueChange={(v) => {
                setType(v as TabTypes)
              }}
            >
              <TabsList className="mb-2">
                <TabsTrigger value={TabTypes.Trades}>Trades</TabsTrigger>
                <TabsTrigger value={TabTypes.Holders}>Holders</TabsTrigger>
              </TabsList>

              {type === TabTypes.Trades && (
                <TabsContent value={TabTypes.Trades}>
                  <TradeList />
                </TabsContent>
              )}
              {type === TabTypes.Holders && (
                <TabsContent value={TabTypes.Holders}>
                  <HolderList />
                </TabsContent>
              )}
            </Tabs> */}
          </div>
        </div>
      </div>
    </div>
  )
}
