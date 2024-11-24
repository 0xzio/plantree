'use client'

import { PlateEditor } from '@/components/editor/plate-editor'
import { useSpaceContext } from '@/components/SpaceContext'

export const dynamic = 'force-static'

export default function Page() {
  const space = useSpaceContext()

  return (
    <div className="bg-amber-100 text-foreground">
      eer
      <PlateEditor value={space.aboutJson} readonly className="px-0 py-0" />
    </div>
  )
}
