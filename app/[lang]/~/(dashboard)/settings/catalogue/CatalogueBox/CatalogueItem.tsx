import { CSSProperties, forwardRef, useState } from 'react'
import { Menu, MenuItem } from '@/components/ui/menu'
import { CatalogueNode } from '@/lib/catalogue'
import { cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { Box, CSSObject, FowerHTMLProps } from '@fower/react'
import { ChevronDown, ChevronRight, Plus } from 'lucide-react'
import { AddNodePopover } from './AddNodePopover'
import { CatalogueIconPopover } from './CatalogueIconPopover'
import { CatalogueMenuPopover } from './CatalogueMenuPopover'
import { useCatalogue } from './hooks/useCatalogue'

interface CatalogueItemProps extends FowerHTMLProps<'div'> {
  depth: number
  name: string
  item: CatalogueNode
  style?: CSSProperties
  css?: CSSObject
  listeners?: ReturnType<typeof useSortable>['listeners']
  sortable?: ReturnType<typeof useSortable>
  onCollapse?: () => void
}

export const CatalogueItem = forwardRef<HTMLDivElement, CatalogueItemProps>(
  function CatalogueItem(
    {
      item,
      name,
      depth,
      sortable,
      listeners,
      onCollapse,
      style = {},
      css = {},
      ...rest
    }: CatalogueItemProps,
    ref,
  ) {
    const [open, setOpen] = useState(false)
    const { addNode } = useCatalogue()
    // console.log('====item:', item)

    return (
      <Box
        ref={ref}
        className={cn(
          'catalogueItem py-1 hover:bg-foreground/5 relative rounded pr-2 flex justify-between items-center mb-[1px] transition-colors',
          sortable?.isOver && item.isCategory && 'bg-brand',
        )}
        pl={depth * 24 + 6}
        css={css}
        style={style}
        {...listeners}
        {...rest}
      >
        <div
          className="flex items-center gap-x-1 flex-1 h-full cursor-pointer text-foreground/50"
          onClick={async (e) => {
            // const node = store.node.getNode(item.id)
            // store.node.selectNode(node)
          }}
        >
          {!!item.children?.length && (
            <div
              className="inline-flex text-foreground/50 hover:bg-foreground/10 rounded items-center h-5 w-5"
              onKeyDown={(e) => {
                e.preventDefault()
              }}
              onPointerDown={(e) => {
                e.preventDefault()
              }}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onCollapse?.()
              }}
            >
              {item.folded && <ChevronRight size={14} />}
              {!item.folded && <ChevronDown size={14} />}
            </div>
          )}

          <div
            className="inline-flex"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <CatalogueIconPopover node={item} />
          </div>

          <div className="text-sm font-medium">{name || 'Untitled'}</div>
        </div>
        <div className="flex items-center gap-1">
          <CatalogueMenuPopover node={item} />
          <AddNodePopover parentId={item.id} />
        </div>
      </Box>
    )
  },
)
