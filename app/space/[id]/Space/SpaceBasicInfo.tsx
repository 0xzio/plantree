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
        className="w-20 h-20 rounded-lg shadow-sm bg-white"
        src={
          space.logo ||
          'https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png'
        }
      />
      <div className="font-semibold text-lg">{space.name}</div>
      {/* <Badge variant="secondary">{isOwner ? 'Owner' : 'Member'}</Badge> */}

      <div className="text-sm text-secondary-foreground">
        {space.description || 'No description yet.'}
      </div>

      <div className="grid gap-1 mt-4">
        <div className="flex items-center justify-center gap-2">
          <SpaceAddress />
        </div>
        <div className="mt-10 text-lg grid grid-cols-1 gap-2 w-full md:w-[560px]">
          <Entry>
            <div></div>
            <div>https://{space.subdomain}.plantree.xyz</div>
            {/* <ExternalLinkIcon size={18} className="text-neutral-500" /> */}
            {isOwner && (
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full w-7 h-7"
                onClick={() => {
                  setIsOpen(true)
                }}
              >
                <Edit3 size={18} />
              </Button>
            )}
          </Entry>

          <Entry
            onClick={() => {
              window.open(`https://www.respace.one/space/${space.address}`)
            }}
          >
            <div></div>
            <div>View in respace.one</div>
            <ExternalLinkIcon
              size={18}
              className="text-neutral-500 cursor-pointer"
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
        'h-[64px] bg-white py-2 px-3 rounded-3xl flex items-center justify-between cursor-pointer shadow-sm',
      )}
      onClick={() => onClick?.()}
    >
      {children}
    </div>
  )
}
