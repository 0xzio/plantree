'use client'

import Editor from '@/components/editor/advanced-editor'
import { useQuerySpace, useSpace } from '@/hooks/useSpace'
import { SpaceInfo } from '../Space/SpaceInfo'

export function PageSpace() {
  useQuerySpace()
  const { space } = useSpace()
  if (!space) return null
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
