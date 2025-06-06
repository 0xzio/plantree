'use client'

import { forwardRef, HTMLAttributes } from 'react'
import { useAddress } from '@/hooks/useAddress'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useSession } from '@/lib/useSession'
import { cn, getUrl, isAddress } from '@/lib/utils'
import { ChevronDown, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { UserAvatar } from '../UserAvatar'

interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string
  showName?: boolean
  showDropIcon?: boolean
  image?: string
  showFullAddress?: boolean
  showCopy?: boolean
}

export const ProfileAvatar = forwardRef<HTMLDivElement, Props>(
  function ProfileAvatar(
    {
      className = '',
      showName,
      showFullAddress,
      showCopy,
      showDropIcon,
      image,
      ...rest
    },
    ref,
  ) {
    const address = useAddress()
    const { data: session } = useSession()
    const shortAddress = address.slice(0, 6) + '...' + address.slice(-4)
    const { copy } = useCopyToClipboard()
    let name = session?.name || ''

    if (isAddress(name)) {
      name = name.slice(0, 3) + '...' + name.slice(-4)
    }
    let src = image || session?.picture
    if (src) src = getUrl(src)

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2', className)}
        {...rest}
      >
        <UserAvatar address={address || name} image={src} />

        {showName && (
          <>
            <div>
              {name && <div className="text-base">{name}</div>}

              <div className="flex gap-2 items-center">
                <div
                  className={cn(
                    'text-sm',
                    name && 'text-xs text-foreground/60',
                  )}
                >
                  {session?.email}
                </div>
                {showCopy && (
                  <Copy
                    size={14}
                    className="text-foreground/60 cursor-pointer hover:text-foreground/80"
                    onClick={() => {
                      copy(session?.email || '')
                      toast.success('Email copied to clipboard')
                    }}
                  ></Copy>
                )}
              </div>

              {/* {showName && address && (
                <div className="flex gap-2 items-center">
                  <div
                    className={cn(
                      'text-sm',
                      name && 'text-xs text-foreground/60',
                    )}
                  >
                    {shortAddress}
                  </div>
                  {showCopy && (
                    <Copy
                      size={14}
                      className="text-foreground/60 cursor-pointer hover:text-foreground/80"
                      onClick={() => {
                        copy(address)
                        toast.success('Address copied to clipboard')
                      }}
                    ></Copy>
                  )}
                </div>
              )} */}
            </div>
          </>
        )}
        {showDropIcon && <ChevronDown size={14} />}
      </div>
    )
  },
)
