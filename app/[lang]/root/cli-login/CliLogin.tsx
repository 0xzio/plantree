'use client'

import React from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc'
import { useSession } from '@/lib/useSession'
import { Trans } from '@lingui/react/macro'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

export function CliLogin() {
  const { openConnectModal } = useConnectModal()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token') as string
  const { data } = useSession()

  const { isPending: isCanceling, mutateAsync: cancel } =
    trpc.cli.cancelLogin.useMutation()

  const { isPending: isConfirming, mutateAsync: confirm } =
    trpc.cli.confirmLogin.useMutation()

  return (
    <div className="p-10 h-screen flex items-center justify-center flex-col bg-background">
      <div className="text-3xl font-bold">
        <Trans>Login to Plantree CLI</Trans>
      </div>
      <div className="text-foreground/500">
        <Trans>Please confirm your authorization for this login.</Trans>
      </div>

      <div className="flex items-center justify-between gap-2 mt-6">
        <Button
          variant="outline"
          className="w-[160px] gap-2"
          disabled={isCanceling}
          onClick={async () => {
            if (isCanceling) return
            try {
              await cancel({ token })
              window.close()
            } catch (error) {
              toast.error('please try again')
            }
          }}
        >
          {isCanceling && <LoadingDots></LoadingDots>}
          <div>
            <Trans>Cancel</Trans>
          </div>
        </Button>
        <Button
          w-160
          disabled={isConfirming}
          onClick={async () => {
            if (!data) {
              return openConnectModal?.()
            }
            try {
              await confirm({ token })
              toast.success(<Trans>CLI login successfully</Trans>)
              location.href = '/'
            } catch (error) {
              toast.error(<Trans>please try again~</Trans>)
            }
          }}
        >
          {isConfirming && <LoadingDots></LoadingDots>}
          <div>
            <Trans>Authorize CLI login</Trans>
          </div>
        </Button>
      </div>
    </div>
  )
}
