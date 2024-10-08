'use client'

import Editor from '@/components/editor/advanced-editor'
import { useSpace } from '@/hooks/useSpace'

export default function Page() {
  const { space } = useSpace()
  return (
    <Editor
      className="p-3 break-all"
      initialValue={space.aboutJson}
      editable={false}
      onChange={(v) => {}}
    />
  )
}
