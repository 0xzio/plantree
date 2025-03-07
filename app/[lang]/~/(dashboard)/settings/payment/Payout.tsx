'use client'

import { useMemo } from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Balance } from '@/lib/types'
import { InputAddressDialog } from './InputAddressDialog/InputAddressDialog'
import { useInputAddressDialog } from './InputAddressDialog/useInputAddressDialog'

interface Props {}

export function Payout({}: Props) {
  const site = useSiteContext()
  const { setIsOpen } = useInputAddressDialog()
  const limit = Number(process.env.NEXT_PUBLIC_MIN_WITHDRAWAL_LIMIT)
  console.log('====site:', site)

  const balance = useMemo(() => {
    if (!site.balance) {
      return {
        withdrawable: 0,
        withdrawing: 0,
        locked: 0,
      } as Balance
    }
    return site.balance as Balance
  }, [site.balance])
  return (
    <div className="space-y-2">
      <InputAddressDialog />
      <div className="text-2xl font-bold">Payout</div>
      <Card>
        <CardHeader>
          <CardTitle>Withdrawals</CardTitle>
          <CardDescription>
            PenX currently only supports withdrawals to crypto wallet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-foreground/60">Balances</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold">
                ${(balance.withdrawable / 100).toFixed(2)}
              </div>
              <div className="text-foreground/60 text-sm">
                On hold: $
                {((balance.withdrawing + balance.locked) / 100).toFixed(2)}
              </div>
            </div>
            <div>
              <Button disabled={balance.withdrawable < limit}>Withdraw</Button>
              <div className="text-foreground/50 text-sm">Minimum $50</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Crypto Wallet</CardTitle>
          <CardDescription>
            Setup crypto wallets to enable withdrawals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {site.walletAddress && (
              <div className="text-foreground/80 text-base">
                Address: {site.walletAddress}
              </div>
            )}
            <Button
              onClick={() => {
                setIsOpen(true)
              }}
            >
              {site.walletAddress ? 'Update address' : 'Set address'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
