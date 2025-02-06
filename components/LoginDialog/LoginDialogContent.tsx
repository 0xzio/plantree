'use client'

import { useCallback } from 'react'
import { SignInButton } from '@/components/facaster-auth'
import { GoogleOauthButton } from '@/components/GoogleOauthButton'
import { TextLogo } from '@/components/TextLogo'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import {
  AuthKitProvider,
  SignInButton as FSignInButton,
  QRCode,
  StatusAPIResponse,
  useProfile,
  useSignIn,
} from '@farcaster/auth-kit'
import { getCsrfToken, signIn, signOut, useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { LoginForm } from './LoginForm'
import { useLoginDialog } from './useLoginDialog'

export function LoginDialogContent() {
  const { setIsOpen } = useLoginDialog()
  const getNonce = useCallback(async () => {
    const nonce = await getCsrfToken()
    if (!nonce) throw new Error('Unable to generate nonce')
    return nonce
  }, [])

  const handleSuccess = useCallback(
    async (res: StatusAPIResponse) => {
      // alert('Signed in successfully')
      await signIn('penx-farcaster', {
        message: res.message,
        signature: res.signature,
        name: res.username,
        pfp: res.pfpUrl,
        redirect: false,
      })

      toast.success('Signed in successfully')
      setIsOpen(false)
    },
    [setIsOpen],
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
          <span className="i-[token--ethm] w-6 h-5"></span>
          <span>Wallet login </span>
        </WalletConnectButton>
      </div>
      {/* <Separator /> */}

      <SignInButton
        // onStatusResponse={(res) => {
        //   alert(JSON.stringify(res))
        // }}
        nonce={getNonce}
        onSuccess={handleSuccess}
        onError={(error) => {
          // alert('Failed to sign in' + JSON.stringify(error))
          toast.error('Failed to sign in')
        }}
        onSignOut={() => signOut()}
      />
      <div className="text-center text-foreground/40">or</div>
      <LoginForm />
    </div>
  )
}
