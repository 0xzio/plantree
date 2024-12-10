'use client'

import { PlateEditor } from '@/components/editor/plate-editor'
import { useSpaceContext } from '@/components/SpaceContext'

export function AboutPage() {
  const space = useSpaceContext()

  return <PlateEditor value={space.aboutJson} readonly className="px-0 py-0" />
}
