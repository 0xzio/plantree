'use client'

import React, { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { formatUsername, getUrl } from '@/lib/utils'
import { cn, withRef } from '@udecode/cn'
import { getMentionOnSelectItem } from '@udecode/plate-mention'
import { UserAvatar } from '../UserAvatar'
import {
  InlineCombobox,
  InlineComboboxContent,
  InlineComboboxEmpty,
  InlineComboboxGroup,
  InlineComboboxInput,
  InlineComboboxItem,
} from './inline-combobox'
import { PlateElement } from './plate-element'

const onSelectItem = getMentionOnSelectItem()

export const MentionInputElement = withRef<typeof PlateElement>(
  ({ className, ...props }, ref) => {
    const { children, editor, element } = props
    const [search, setSearch] = useState('')

    const {
      data = [],
      isLoading,
      isFetching,
    } = trpc.user.search.useQuery({
      q: search,
    })

    return (
      <PlateElement
        ref={ref}
        as="span"
        data-slate-value={element.value}
        {...props}
      >
        <InlineCombobox
          value={search}
          element={element}
          setValue={setSearch}
          showTrigger={true}
          filter={false}
          trigger="@"
        >
          <span
            className={cn(
              'inline-block rounded-md bg-muted px-1.5 py-0.5 align-baseline text-sm ring-ring focus-within:ring-2',
              className,
            )}
          >
            <InlineComboboxInput />
          </span>

          <InlineComboboxContent className="my-1.5 min-h-32 overflow-y-auto">
            <InlineComboboxGroup className="flex flex-col gap-2">
              {(isLoading || isFetching) && (
                <InlineComboboxEmpty>Loading...</InlineComboboxEmpty>
              )}
              {data.map((item) => (
                <InlineComboboxItem
                  key={item.id}
                  value={item.id}
                  className="flex items-center gap-2 h-10"
                  onClick={() =>
                    onSelectItem(
                      editor,
                      {
                        text: `${item.image || ''}___${item.displayName || ''}`,
                      },
                      search,
                    )
                  }
                >
                  <UserAvatar
                    address={item.email || item.displayName || ''}
                    image={item.image ? getUrl(item.image) : ''}
                  />
                  {formatUsername(item.displayName || '', 5, 4)}
                </InlineComboboxItem>
              ))}
            </InlineComboboxGroup>
          </InlineComboboxContent>
        </InlineCombobox>

        {children}
      </PlateElement>
    )
  },
)
