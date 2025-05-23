import React, { PropsWithChildren, useEffect, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CatalogueNode } from '@/lib/catalogue'
import EmojiPicker, { Emoji, EmojiStyle } from 'emoji-picker-react'
import { File } from 'lucide-react'
import { useCatalogue } from './hooks/useCatalogue'

interface Props {
  node: CatalogueNode
}

export const CatalogueIconPopover = ({ node }: PropsWithChildren<Props>) => {
  const [isOpen, setIsOpen] = useState(false)
  const { updateEmoji } = useCatalogue()
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="h-5 w-5 flex justify-center items-center rounded hover:bg-foreground/20">
          {node.emoji && (
            <Emoji
              unified={node.emoji}
              emojiStyle={EmojiStyle.APPLE}
              size={18}
            />
          )}

          {!node.emoji && <File size={16} />}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 shadow-none">
        <EmojiPicker
          // width="400"
          onEmojiClick={(v) => {
            updateEmoji(node.id, v.unified)
            setIsOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
