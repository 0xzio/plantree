'use client'

import { PropsWithChildren } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UpdateSpaceDialog } from '@/components/UpdateSpaceDialog/UpdateSpaceDialog'
import { useUpdateSpaceDialog } from '@/components/UpdateSpaceDialog/useUpdateSpaceDialog'
import { useAddress } from '@/hooks/useAddress'
import { useSpace } from '@/hooks/useSpace'
import { cn } from '@/lib/utils'
import { Edit3, ExternalLinkIcon } from 'lucide-react'
import { SpaceAddress } from './SpaceAddress'

interface Props {}

export function SpaceBasicInfo({}: Props) {
  const address = useAddress()
  const { space } = useSpace()

  const { setIsOpen } = useUpdateSpaceDialog()
  const isOwner = space.isFounder(address)

  return (
    <div className="flex flex-col items-center gap-2">
      <UpdateSpaceDialog />
      <img
        alt={space.name || ''}
        className="w-20 h-20 rounded-lg shadow-sm bg-background"
        src={
          space.logo ||
          'https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png'
        }
      />
      <div className="flex gap-2">
        <div className="font-bold text-2xl">{space.name}</div>
        {isOwner && <Badge>Owner</Badge>}
      </div>

      <div className="text-sm text-secondary-foreground">
        {space.description || 'No description yet.'}
      </div>

      <div className="flex flex-col gap-1 mt-4 text-foreground w-full">
        <div className="flex items-center justify-center gap-2">
          <SpaceAddress />
        </div>
        <div className="mt-10 text-lg grid grid-cols-1 gap-2 w-full">
          <Entry>
            <div></div>
            <div>{space.siteUrl ? space.siteUrl : 'Set your site URL'}</div>
            <div>
              {isOwner && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full w-7 h-7"
                  onClick={() => {
                    setIsOpen(true)
                  }}
                >
                  <Edit3
                    size={18}
                    className="cursor-pointer text-foreground/50"
                  />
                </Button>
              )}
            </div>
          </Entry>

          <Entry
            onClick={() => {
              window.open(
                `https://www.respace.one/space/${space.address}`,
              )
            }}
          >
            <div></div>
            <div>
              View in <span className="text-brand-500">respace.one</span>
            </div>
            <ExternalLinkIcon
              size={18}
              className="cursor-pointer text-foreground/50"
            />
          </Entry>

          <Entry
            onClick={() => {
              window.open(
                `https://www.respace.one/space/${space.address}`,
              )
            }}
          >
            <div></div>
            <div>
              Buy site token{' '}
              <span className="font-bold">${space.symbolName}</span>
            </div>
            <ExternalLinkIcon
              size={18}
              className="cursor-pointer text-foreground/50"
            />
          </Entry>
        </div>
      </div>
    </div>
  )
}

function Entry({
  className = '',
  onClick,
  children,
}: PropsWithChildren<{ className?: string; onClick?: () => void }>) {
  return (
    <div
      className={cn(
        className,
        'h-[64px] bg-background dark:bg-background/50 py-2 px-3 rounded-3xl flex items-center justify-between cursor-pointer shadow-sm',
      )}
      onClick={() => onClick?.()}
    >
      {children}
    </div>
  )
}
