'use client'

import { NodeEditorApp } from '@/components/EditorApp/NodeEditorApp'
import { Node } from '@/lib/model'
import { store } from '@/store'
import { useQuery } from '@tanstack/react-query'

export const dynamic = 'force-static'

export default function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['note', 'today'],
    queryFn: async () => {
      return store.node.selectDailyNote(new Date(), false)
    },
  })

  if (isLoading) return null

  const node = new Node(data!)
  return <NodeEditorApp node={node}></NodeEditorApp>
}
