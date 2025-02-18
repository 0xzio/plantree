'use client'

import { forwardRef } from 'react'
import { CatalogueNodeType, ICatalogueNode } from '@/lib/model'
import { cn } from '@/lib/utils'
import { FowerHTMLProps } from '@fower/react'
import { Emoji, EmojiStyle } from 'emoji-picker-react'
import { ChevronDown, ChevronRight, Plus } from 'lucide-react'
import Link from 'next/link'

interface CatalogueItemProps extends FowerHTMLProps<'div'> {
  depth: number
  name: string
  item: ICatalogueNode
}

export const CatalogueItem = forwardRef<HTMLDivElement, CatalogueItemProps>(
  function CatalogueItem({ item, name, depth }: CatalogueItemProps, ref) {
    // console.log('=========>>item:', item)

    const isCategory = item.type === CatalogueNodeType.CATEGORY
    return (
      <Link
        href={`/posts/${item.uri}`}
        className={cn(
          'catalogueItem py-1 hover:bg-foreground/5 relative rounded px-2 flex justify-between items-center mb-[1px] transition-colors cursor-pointer',
          isCategory && 'mt-6',
        )}
        style={
          {
            // paddingLeft: depth * 24 + 6,
          }
        }
        onClick={(e) => {
          if (isCategory) {
            e.preventDefault()
            console.log('category clicked:', item.id)
          }
        }}
      >
        <div
          className="flex items-center gap-x-1 flex-1 h-full cursor-pointer text-foreground/50"
          // onClick={async (e) => {
          // }}
        >
          {item.emoji && (
            <div
              className="inline-flex flex-shrink-0"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <Emoji
                unified={item.emoji}
                emojiStyle={EmojiStyle.APPLE}
                size={18}
              />
            </div>
          )}

          <div
            className={cn(
              'text-[15px] text-foreground/70',
              isCategory && 'font-bold text-foreground text-base',
            )}
          >
            {name || 'Untitled'}
          </div>
        </div>

        {!!item.children?.length && (
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
        )}
      </Link>
    )
  },
)
