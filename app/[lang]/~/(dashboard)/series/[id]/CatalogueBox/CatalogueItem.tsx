import { CSSProperties, forwardRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Menu, MenuItem } from '@/components/ui/menu'
import { CatalogueNode } from '@/lib/catalogue'
import { Link } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { Box, CSSObject, FowerHTMLProps } from '@fower/react'
import { Trans } from '@lingui/react/macro'
import { Post, PostStatus } from '@prisma/client'
import { format } from 'date-fns'
import { ChevronDown, ChevronRight, Edit3Icon, Plus } from 'lucide-react'
import { AddNodePopover } from './AddNodePopover'
import { CatalogueIconPopover } from './CatalogueIconPopover'
import { CatalogueMenuPopover } from './CatalogueMenuPopover'
import { useCatalogue } from './hooks/useCatalogue'

interface CatalogueItemProps extends FowerHTMLProps<'div'> {
  depth: number
  name: string
  item: CatalogueNode
  post: Post
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
      post,
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
          'catalogueItem py-1 relative rounded pr-2 flex justify-between items-center mb-[1px] transition-colors',
          sortable?.isOver && item.isCategory && 'bg-brand',
        )}
        pl={depth * 24 + 6}
        css={css}
        style={style}
        {...listeners}
        {...rest}
      >
        <div
          className="flex items-center gap-x-1 flex-1 h-full cursor-pointer"
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

          <span className="icon-[radix-icons--drag-handle-dots-2]"></span>
          {/* <div
            className="inline-flex"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <CatalogueIconPopover node={item} />
          </div> */}

          <div className="">
            <Link
              href={`/~/post?id=${item.uri}&from=/~/series/${post.seriesId!}`}
              className="text-lg font-semibold hover:scale-105 origin-left transition-all"
            >
              {name || 'Untitled'}
            </Link>
            <div className="flex items-center gap-2">
              <div className="text-xs text-foreground/60">
                {format(post.publishedAt || post.createdAt, 'yyyy-MM-dd')}
              </div>

              {post.status === PostStatus.DRAFT && (
                <div className="text-foreground/50 text-xs">
                  <Trans>Draft</Trans>
                </div>
              )}

              {post.status === PostStatus.PUBLISHED && (
                <div className="text-green-500 text-xs">
                  <Trans>Published</Trans>
                </div>
              )}

              {post.status === PostStatus.ARCHIVED && (
                <div className="text-green-500 text-xs">
                  <Trans>Archived</Trans>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* <CatalogueMenuPopover node={item} /> */}
          {/* <AddNodePopover parentId={item.id} /> */}

          <Link
            href={`/~/post?id=${item.uri}&from=/~/series/${post.seriesId!}`}
          >
            <Button
              size="xs"
              variant="ghost"
              className="rounded-full text-xs h-7 gap-1 opacity-50"
            >
              <Edit3Icon size={14}></Edit3Icon>
              <div>
                <Trans>Edit</Trans>
              </div>
            </Button>
          </Link>
        </div>
      </Box>
    )
  },
)
