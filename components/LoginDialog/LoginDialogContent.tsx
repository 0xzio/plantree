'use client'

import { useCallback } from 'react'
import { SignInButton } from '@/components/facaster-auth'
import { GoogleOauthButton } from '@/components/GoogleOauthButton'
import { TextLogo } from '@/components/TextLogo'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { api } from '@/lib/trpc'
import { useSession } from '@/lib/useSession'
import {
  AuthKitProvider,
  SignInButton as FSignInButton,
  QRCode,
  StatusAPIResponse,
  useProfile,
  useSignIn,
} from '@farcaster/auth-kit'
import { Trans } from '@lingui/react/macro'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { LoginForm } from './LoginForm'
import { useLoginDialog } from './useLoginDialog'

export function LoginDialogContent() {
  const { setIsOpen } = useLoginDialog()
  const { login, logout } = useSession()
  const searchParams = useSearchParams()
  const showWalletLogin = searchParams?.get('wallet') === 'true'

  const handleSuccess = useCallback(
    async (res: StatusAPIResponse) => {
      // alert('Signed in successfully')
      await login({
        type: 'penx-farcaster',
        message: res.message!,
        signature: res.signature!,
        name: res.username!,
        pfp: res.pfpUrl!,
      })

      toast.success('Signed in successfully')
      setIsOpen(false)
    },
    [setIsOpen, login],
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="space-y-1">
        {/* <div className="text-foreground/40">Web2 login</div> */}
        <GoogleOauthButton
          variant="outline"
          size="lg"
          className="w-full border-foreground"
        />
      </div>
      {showWalletLogin && (
        <div className="space-y-1">
          {/* <div className="text-foreground/40">Wallet login</div> */}
          <WalletConnectButton
            variant="outline"
            size="lg"
            className="w-full border-foreground"
            onClick={() => {
              setIsOpen(false)
            }}
          >
            <span className="icon-[token--ethm] w-6 h-5"></span>
            <span>
              <Trans>Wallet login </Trans>
            </span>
          </WalletConnectButton>
        </div>
      )}
      {/* <Separator /> */}

      {/* <SignInButton
        // onStatusResponse={(res) => {
        //   alert(JSON.stringify(res))
        // }}
        nonce={api.user.getNonce.query}
        onSuccess={handleSuccess}
        onError={(error) => {
          // alert('Failed to sign in' + JSON.stringify(error))
          toast.error('Failed to sign in')
        }}
        onSignOut={() => logout()}
      /> */}
      <div className="text-center text-foreground/40">or</div>
      <LoginForm />
    </div>
  )
}
