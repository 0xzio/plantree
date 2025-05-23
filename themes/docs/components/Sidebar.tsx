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
  className?: string
  height?: string
}

export const Sidebar = ({ site, className, height }: Props) => {
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
      className={cn(
        'sidebar md:w-60 md:sticky top-0 md:top-16 shrink-0 pt-0 pb-16 md:overflow-y-auto md:pb-8',
        className,
      )}
      style={{
        height: height || 'calc(100vh - 4rem)',
      }}
    >
      {flattenedItems.map((item) => {
        return (
          <CatalogueItem
            key={item.id}
            name={item.title || 'Untitled'}
            item={item as any}
            depth={item.depth}
          />
        )
      })}
    </aside>
  )
}
