'use client'

import { Profile } from '@/components/Profile/Profile'
import { useSpaceContext } from '@/components/SpaceContext'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getUrl } from '@/lib/utils'
import Link from 'next/link'

interface Props {}

export function SpaceHeader({}: Props) {
  const space = useSpaceContext()
  return (
    <header className="flex h-16 items-center justify-between px-4">
      <div className="flex flex-1 items-center gap-2 ">
        <Link
          href="/"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-foreground/5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            // width="1em"
            // height="2em"
            viewBox="0 0 12 24"
            className="h-6"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="m3.343 12l7.071 7.071L9 20.485l-7.778-7.778a1 1 0 0 1 0-1.414L9 3.515l1.414 1.414z"
            ></path>
          </svg>
        </Link>
        <div className="flex items-center gap-2">
          <img
            alt={space.name || ''}
            className="h-9 w-9 rounded-lg bg-foreground shadow-sm"
            src={getUrl(space.logo)}
          />

          <div className="text-lg font-bold">{space.name}</div>
          <Separator orientation="vertical" className="h-4 bg-foreground/30" />
          <div className="text-lg font-bold">${space.symbolName}</div>
        </div>
      </div>
      <div className="flex flex-1 justify-end">
        <Profile />
      </div>
    </header>
  )
}
