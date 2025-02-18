import type { MutableRefObject } from 'react'
import { Profile } from '@/components/Profile/Profile'
import { Airdrop } from '@/components/theme-ui/Airdrop'
import { CatalogueNode, CatalogueTree } from '@/lib/catalogue'
import { ICatalogueNode } from '@/lib/model'
import { Site } from '@/lib/theme.types'
import { cn, getUrl } from '@/lib/utils'
import { CatalogueItem } from './CatalogueItem'

export interface TreeItem extends Omit<CatalogueNode, 'children'> {
  children: TreeItem[]
}

export type TreeItems = TreeItem[]

export interface FlattenedItem extends TreeItem {
  parentId: string
  depth: number
  index: number
}

function flatten(
  items: TreeItems,
  parentId: string = null as any,
  depth = 0,
): FlattenedItem[] {
  return items.reduce<FlattenedItem[]>((acc, item, index) => {
    return [
      ...acc,
      { ...(item.toJSON() as any), parentId, depth, index },
      ...flatten(item.children, item.id, depth + 1),
    ]
  }, [])
}

export function flattenTree(items: TreeItems): FlattenedItem[] {
  return flatten(items)
}
type UniqueIdentifier = string | number

export function removeChildrenOf(
  items: FlattenedItem[],
  ids: UniqueIdentifier[],
) {
  const excludeParentIds = [...ids]

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item.children.length) {
        excludeParentIds.push(item.id)
      }
      return false
    }

    return true
  })
}

interface Props {
  site: Site
}

export const Sidebar = ({ site }: Props) => {
  const tree = CatalogueTree.fromJSON(
    Array.isArray(site.catalogue) ? site.catalogue : [],
  )

  const flattenItems = () => {
    const flattenedTree = flattenTree(tree.nodes)

    const foldedItems = flattenedTree.reduce<string[]>(
      (acc, { children, folded, id }) =>
        folded && children.length ? [...acc, id] : acc,
      [],
    )

    return removeChildrenOf(flattenedTree, foldedItems)
  }
  const flattenedItems = flattenItems()

  return (
    <aside
      className="sidebar w-64 sticky top-16 flex-shrink-0 py-8 overflow-y-auto"
      style={{
        height: 'calc(100vh - 4rem)',
      }}
    >
      {flattenedItems.map((item) => {
        return (
          <CatalogueItem
            key={item.id}
            name={item.title || 'Untitled'}
            item={item}
            depth={item.depth}
          />
        )
      })}
    </aside>
  )
}
