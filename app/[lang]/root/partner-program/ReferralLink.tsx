'use client'

import { useMemo } from 'react'
import { useLoginDialog } from '@/components/LoginDialog/useLoginDialog'
import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { trpc } from '@/lib/trpc'
import { useSession } from '@/lib/useSession'
import { CopyIcon } from 'lucide-react'
import { toast } from 'sonner'

export function ReferralLink() {
  const { copy } = useCopyToClipboard()
  const { session } = useSession()
  const { data } = trpc.user.getReferralCode.useQuery()
  const { setIsOpen } = useLoginDialog()

  const link = useMemo(() => {
    if (!session || !data) {
      return `${process.env.NEXT_PUBLIC_ROOT_HOST}?ref=******`
    }
    return `${process.env.NEXT_PUBLIC_ROOT_HOST}?ref=${data}`
  }, [session, data])

  return (
    <>
      <div className="h-12 flex items-center justify-center">
        <div className="px-5 py-2 rounded-full border-foreground border-2 inline-flex items-center gap-2">
          <span>{link}</span>
          <CopyIcon
            size={16}
            className="cursor-pointer text-foreground/60 hover:text-foreground"
            onClick={() => {
              if (!session) {
                return toast.info('Please sign in to copy referral link')
              }
              copy(link)
              toast.success('Referral link copied to clipboard')
            }}
          />
        </div>
      </div>
      <div>
        <Button
          size="xl"
          className="px-8"
          onClick={() => {
            if (!session) {
              setIsOpen(true)
            } else {
              copy(link)
              toast.success('Referral link copied to clipboard')
            }
          }}
        >
          Start earning
        </Button>
      </div>
    </>
  )
}
