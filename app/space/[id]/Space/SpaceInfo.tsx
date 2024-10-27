'use client'

import { useSpace } from '@/hooks/useSpace'
import { SpaceBasicInfo } from './SpaceBasicInfo'

interface Props {}

export function SpaceInfo({}: Props) {
  const { space } = useSpace()
  if (!space) return null

  return (
    <div className="grid gap-6">
      <SpaceBasicInfo />
    </div>
  )
}
