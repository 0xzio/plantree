'use client'

import { ReactNode, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSpace } from '@/hooks/useSpace'
import { HolderList } from '../Space/HolderList'
import { SpaceInfo } from '../Space/SpaceInfo'

export default function Layout({ children }: { children: ReactNode }) {
  const { space } = useSpace()

  if (!space) return null

  return (
    <div>
      <div className="flex lg:flex-row flex-col-reverse w-full sm:w-full mx-auto gap-12 mt-10 p-3 lg:p-0">
        <div className="flex flex-col gap-6 md:flex-1 rounded-2xl w-full md:w-auto">
          <SpaceInfo />
          {children}
        </div>
      </div>
    </div>
  )
}
