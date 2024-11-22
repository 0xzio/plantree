'use client'

import { Badge } from '@/components/ui/badge'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useSpace } from '@/hooks/useSpace'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

export function SpaceAddress() {
  const { space } = useSpace()
  const { address = '' } = space
  const { copy } = useCopyToClipboard()
  return (
    <Badge
      variant="secondary"
      size="sm"
      className="text-sm rounded-md bg-transparent"
    >
      (Space ID) {address}
      <Copy
        size={14}
        className="text-neutral-500 cursor-pointer hover:text-neutral-800 ml-1"
        onClick={() => {
          copy(address!)
          toast.success('Space contract address copied to clipboard')
        }}
      ></Copy>
    </Badge>
  )
}
