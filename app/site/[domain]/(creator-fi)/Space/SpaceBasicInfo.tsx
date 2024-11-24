'use client'

import { useSpaceContext } from '@/components/SpaceContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UpdateSpaceDialog } from '@/components/UpdateSpaceDialog/UpdateSpaceDialog'
import { useUpdateSpaceDialog } from '@/components/UpdateSpaceDialog/useUpdateSpaceDialog'
import { useAddress } from '@/hooks/useAddress'
import { Edit3 } from 'lucide-react'
import { SpaceAddress } from './SpaceAddress'

interface Props {}

export function SpaceBasicInfo({}: Props) {
  const address = useAddress()
  const space = useSpaceContext()
  const { setIsOpen } = useUpdateSpaceDialog()
  const isOwner = space.isFounder(address)

  return (
    <div className="flex items-center gap-2">
      <UpdateSpaceDialog />
      <img
        alt={space.name || ''}
        className="w-20 h-20 rounded-lg shadow-sm bg-background"
        src={
          space.logo ||
          'https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png'
        }
      />

      <div className="grid gap-1">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-lg">{space.name}</div>
          <Badge variant="secondary">{isOwner ? 'Owner' : 'Member'}</Badge>
          <SpaceAddress />
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
        </div>
        <div className="text-sm text-secondary-foreground">
          {space.description || 'No description yet.'}
        </div>
      </div>
    </div>
  )
}
