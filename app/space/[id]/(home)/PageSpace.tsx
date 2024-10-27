'use client'

import Editor from '@/components/editor/advanced-editor'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuerySpace, useSpace } from '@/hooks/useSpace'
import { SpaceInfo } from '../Space/SpaceInfo'

export function PageSpace() {
  const { isLoading } = useQuerySpace()
  const { space } = useSpace()
  if (!space || isLoading) {
    return (
      <div className="space-y-10">
        <div className="flex flex-col justify-center items-center gap-2">
          <Skeleton className="w-20 h-20 rounded-xl" />
          <Skeleton className="w-20 h-6" />
          <Skeleton className="w-64 h-6" />
        </div>
        <div className="flex justify-center w-full">
          <div className="flex flex-col gap-2 w-full sm:w-[560px]">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div>
      <SpaceInfo />
      <Editor
        className="p-3 break-all"
        initialValue={space.aboutJson}
        editable={false}
        onChange={(v) => {}}
      />
    </div>
  )
}
