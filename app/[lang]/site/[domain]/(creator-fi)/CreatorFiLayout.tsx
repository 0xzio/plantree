'use client'

import { PropsWithChildren, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { useQueryEthPrice } from '@/hooks/useEthPrice'
import { HolderList } from './Space/HolderList'
import { SpaceHeader } from './Space/SpaceHeader'
import { SpaceInfo } from './Space/SpaceInfo'
import { TradeList } from './Space/TradeList'
import { Transaction } from './Space/Transaction'

enum TabTypes {
  Holders = 'Holders',
  Trades = 'Trades',
}

interface Props {}

export function CreatorFiLayout({ children }: PropsWithChildren<Props>) {
  const [type, setType] = useState(TabTypes.Trades)
  useQueryEthBalance()
  useQueryEthPrice()

  return (
    <div>
      <SpaceHeader />
      <div className="flex lg:flex-row flex-col-reverse w-full sm:w-full mx-auto gap-12 mt-10 p-3 lg:p-0 lg:max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-1 rounded-2xl w-full md:w-auto">
          <SpaceInfo />
          {children}
        </div>

        <div className="flex flex-col w-full lg:w-[360px] flex-shrink-0">
          <Transaction />
          <div className="mt-8 lg:block">
            <Tabs
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
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
