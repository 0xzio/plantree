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

  return (
    <div className="flex flex-col gap-3 pb-6">
      <div className="space-y-1">
        <GoogleOauthButton
          variant="outline"
          size="lg"
          className="w-full border-foreground"
        />
      </div>

      {/* <div className="text-center text-foreground/40">or</div> */}
      {/* <LoginForm /> */}
    </div>
  )
}
