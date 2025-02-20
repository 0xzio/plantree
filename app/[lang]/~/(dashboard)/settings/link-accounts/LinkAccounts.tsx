'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { PasswordDialog } from '@/components/PasswordDialog/PasswordDialog'
import { useMyAccounts } from '@/hooks/useMyAccounts'
import { ProviderType } from '@prisma/client'
import { AccountList } from './AccountList'
import { LinkGoogleButton } from './LinkGoogleButton'
import { LinkPasswordButton } from './LinkPasswordButton'
import { LinkWalletButton } from './LinkWalletButton'

export function LinkAccounts() {
  const { isLoading, data: accounts = [] } = useMyAccounts()

  const hasGoogleAccount = accounts.some(
    (a) => a.providerType === ProviderType.GOOGLE,
  )

  const hasWallet = accounts.some((a) => a.providerType === ProviderType.WALLET)

  const hasPassword = accounts.some(
    (a) => a.providerType === ProviderType.PASSWORD,
  )

  return (
    <div className="">
      <PasswordDialog />

      {isLoading && <LoadingDots className="bg-foreground/60" />}
      {!isLoading && (
        <div className="grid gap-6 w-full md:w-[400px]">
          <AccountList />
          <div className="space-y-2">
            {!hasGoogleAccount && <LinkGoogleButton />}
            {!hasWallet && <LinkWalletButton />}
            {!hasPassword && <LinkPasswordButton />}
          </div>
        </div>
      )}
    </div>
  )
}
