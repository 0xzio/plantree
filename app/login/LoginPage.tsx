'use client'

import { useCallback, useEffect, useState } from 'react'
import { SignInButton } from '@/components/facaster-auth'
import { GoogleOauthButton } from '@/components/GoogleOauthButton'
import { TextLogo } from '@/components/TextLogo'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import Link from 'next/link'
import { toast } from 'sonner'

export function LoginPage() {
  const getNonce = useCallback(async () => {
    const nonce = await getCsrfToken()
    if (!nonce) throw new Error('Unable to generate nonce')
    return nonce
  }, [])

  const handleSuccess = useCallback(async (res: StatusAPIResponse) => {
    // alert('Signed in successfully')
    await signIn('penx-farcaster', {
      message: res.message,
      signature: res.signature,
      name: res.username,
      pfp: res.pfpUrl,
      redirect: false,
    })

    toast.success('Signed in successfully')
  }, [])

  return (
    <div className="h-screen flex flex-col items-center justify-between relative">
      <Link
        href="/"
        className="text-xl font-bold text-foreground/60 hover:text-foreground py-4 cursor-pointer z-20"
      >
        <TextLogo />
      </Link>
      <div className="flex-1 flex items-center justify-center w-full -mt-20 z-10 px-4 sm:px-0">
        <Card className="flex flex-col w-full sm:w-96">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Login with Google or Web3 Wallets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              {/* <div className="text-foreground/40">Web2 login</div> */}
              <GoogleOauthButton
                variant="secondary"
                size="lg"
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              {/* <div className="text-foreground/40">Wallet login</div> */}
              <WalletConnectButton size="lg" className="w-full">
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
