'use client'

import { useRef, useState } from 'react'
import { convertTimeToSeconds } from '@/lib/utils'
import { cn, withRef } from '@udecode/cn'
import {
  PlateElement,
  useEditorSelector,
  useElement,
  useSelected,
} from '@udecode/plate/react'
import { PlayIcon, TimerIcon } from 'lucide-react'
import { TPodcastTimeElement } from '../custom-plate-plugins/podcast-time'
import { PodcastTimePopoverContent } from './podcast-time-popover'
import { Popover, PopoverTrigger } from './popover'

export const PodcastTimeElement = withRef<typeof PlateElement>(
  ({ children, className, ...props }, ref) => {
    const element = useElement<TPodcastTimeElement>()
    const pointRef = useRef<HTMLDivElement | null>(null)
    const selected = useSelected()
    const isCollapsed = useEditorSelector(
      (editor) => editor.api.isCollapsed(),
      [],
    )
    const [open, setOpen] = useState(selected && isCollapsed)

    return (
      <PlateElement
        ref={ref}
        className={cn(
          'inline-block rounded-sm select-none relative',
          className,
        )}
        {...props}
      >
        <a
          href={`#t=${props.element.point || '00:00'}`}
          className="absolute -right-2 -top-3 inline-flex bg-background rounded-full p-0.5 cursor-pointer shadow border border-foreground/10 z-20 hover:scale-110 transition-all"
          onClick={(e) => {
            const href = e.currentTarget.getAttribute('href') || ''
            const player = window.__PLAYER__
            player.seek(convertTimeToSeconds(href?.replace('#t=', '')))
            if (player.audio.paused) {
              player.play()
            }
          }}
        >
          <PlayIcon size={12} />
        </a>
        <Popover open={open} onOpenChange={setOpen} modal={false}>
          <PopoverTrigger asChild>
            <div
              className={cn(
                'after:absolute after:inset-0 after:-top-0.5 after:-left-1 after:z-1 after:h-[calc(100%)+4px] after:w-[calc(100%+8px)] after:rounded-sm after:content-[""]',
                'h-6',
                element.point.length > 0 && open && 'after:bg-brand/15',
                element.point.length === 0 &&
                  'text-muted-foreground after:bg-neutral-500/10',
                className,
              )}
              contentEditable={false}
            >
              <span
                ref={pointRef}
                className={cn(
                  element.point.length === 0 && 'hidden',
                  'font-mono leading-none',
                )}
              />
              {element.point.length === 0 && (
                <span>
                  <TimerIcon className="mr-1 inline-block h-[19px] w-4 py-[1.5px] align-text-bottom" />
                  Podcast time
                </span>
              )}
              {element.point && (
                <span className="bg-foreground/5 px-1 py-0.5 rounded">
                  {element.point}
                </span>
              )}
            </div>
          </PopoverTrigger>

          <PodcastTimePopoverContent
            className="my-auto"
            open={open}
            placeholder="00:03:14"
            setOpen={setOpen}
            isInline
          />
        </Popover>
        {children}
      </PlateElement>
    )
  },
)
