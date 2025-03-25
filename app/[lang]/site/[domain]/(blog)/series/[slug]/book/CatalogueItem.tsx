'use client'

import { forwardRef, useMemo } from 'react'
import { useSeriesContext } from '@/components/SeriesContext'
import { useMobileSidebarSheet } from '@/components/theme-ui/MobileSidebar'
import { Link } from '@/lib/i18n'
import {
  CatalogueNodeJSON,
  CatalogueNodeType,
  ICatalogueNode,
} from '@/lib/model'
import { Post } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { FowerHTMLProps } from '@fower/react'
import { Emoji, EmojiStyle } from 'emoji-picker-react'
import { useParams } from 'next/navigation'

interface CatalogueItemProps extends FowerHTMLProps<'div'> {
  depth: number
  name: string
  item: CatalogueNodeJSON
  post: Post
}

export const CatalogueItem = forwardRef<HTMLDivElement, CatalogueItemProps>(
  function CatalogueItem({ item, name, post, depth }: CatalogueItemProps, ref) {
    const series = useSeriesContext()
    const { setIsOpen } = useMobileSidebarSheet()
    const isCategory = item.type === CatalogueNodeType.CATEGORY
    const params = useParams() as Record<string, string>
    const postSlug = params.postSlug || ''
    const isActive = postSlug === post?.slug

    const href = useMemo(() => {
      return `/series/${series.slug}/${post?.slug}`
    }, [item])

    const linkProps: Record<string, string> = {}
    if (item.type === CatalogueNodeType.LINK && item.uri?.startsWith('http')) {
      linkProps.target = '_blank'
    }

    return (
      <Link
        href={href}
        {...linkProps}
        className={cn(
          'catalogueItem py-1 relative rounded px-2 flex justify-between items-center mb-[1px] transition-colors',
          isCategory && 'mt-6',
          !isCategory && 'hover:bg-foreground/5 cursor-pointer',
          isActive && 'bg-foreground/5',
        )}
        style={
          {
            // paddingLeft: depth * 24 + 6,
          }
        }
        onClick={(e) => {
          setIsOpen?.(false)
          if (isCategory) {
            e.preventDefault()
            console.log('category clicked:', item.id)
          }
        }}
      >
        <div className="flex items-center gap-x-1 flex-1 h-full cursor-pointer text-foreground/50">
          {item.emoji && (
            <Emoji
              unified={item.emoji}
              emojiStyle={EmojiStyle.APPLE}
              size={18}
            />
          )}

          <div
            className={cn(
              'text-[15px] text-foreground/70',
              isCategory && 'font-semibold text-foreground text-base',
              isActive && 'text-foreground/90',
            )}
          >
            {name || 'Untitled'}
          </div>
        </div>

        {/* {!!item.hasChildren && (
          <div
            className="inline-flex text-foreground/50 hover:bg-foreground/10 rounded justify-center items-center h-5 w-5"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            {item.folded && <ChevronRight size={14} />}
            {!item.folded && <ChevronDown size={14} />}
          </div>
        )} */}
      </Link>
    )
  },
)
