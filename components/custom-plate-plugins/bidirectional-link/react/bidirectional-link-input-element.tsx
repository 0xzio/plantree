'use client'

import React, { useState } from 'react'
import {
  InlineCombobox,
  InlineComboboxContent,
  InlineComboboxEmpty,
  InlineComboboxGroup,
  InlineComboboxInput,
  InlineComboboxItem,
} from '@/components/plate-ui/inline-combobox'
import { usePosts } from '@/hooks/usePosts'
import { cn } from '@/lib/utils'
import { withRef } from '@udecode/cn'
import { PlateElement } from '@udecode/plate/react'
import { getBidirectionalLinkOnSelectItem } from '../lib'

const onSelectItem = getBidirectionalLinkOnSelectItem()

export const BidirectionalLinkInputElement = withRef<typeof PlateElement>(
  ({ className, ...props }, ref) => {
    const { children, editor, element } = props
    return (
      <PlateElement
        ref={ref}
        as="span"
        className={cn(className, 'min-h-40')}
        data-slate-value={element.value}
        {...props}
      >
        <Content editor={editor} element={element} />
        {children}
      </PlateElement>
    )
  },
)

function Content({ editor, element }: any) {
  const [search, setSearch] = useState('')
  const { data = [], isLoading } = usePosts()
  console.log('===isLoading:', isLoading, data)

  if (isLoading) return <div>Loading...</div>
  return (
    <InlineCombobox
      value={search}
      element={element}
      setValue={setSearch}
      trigger="[["
    >
      <span className="inline-block rounded-md bg-muted px-1.5 py-0.5 align-baseline text-sm ring-ring focus-within:ring-2">
        <InlineComboboxInput />
      </span>

      <InlineComboboxContent className="my-1.5">
        <InlineComboboxEmpty>No results</InlineComboboxEmpty>

        <InlineComboboxGroup>
          {data.map((item) => (
            <InlineComboboxItem
              key={item.id}
              value={item.id}
              onClick={() => onSelectItem(editor, item, search)}
            >
              {item.title}
            </InlineComboboxItem>
          ))}
        </InlineComboboxGroup>
      </InlineComboboxContent>
    </InlineCombobox>
  )
}
