'use client'

import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { InputAddressDialog } from './InputAddressDialog/InputAddressDialog'
import { useInputAddressDialog } from './InputAddressDialog/useInputAddressDialog'

interface Props {}

export function Payout({}: Props) {
  const site = useSiteContext()
  const { setIsOpen } = useInputAddressDialog()
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
            <div className="text-4xl font-bold">
              ${(site.balance / 100).toFixed(2) || '0'}
            </div>
            <div>
              <Button disabled={site.balance < 5000}>Withdraw</Button>
              <div className="text-foreground/50 text-sm">Minimum $50</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
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
