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
import { Check } from 'lucide-react'
import { getCsrfToken, signIn, signOut, useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { UseCouponCode } from '../UseCouponCode'
import { useSubscriptionDialog } from './useSubscriptionDialog'

export function SubscriptionDialogContent() {
  const { setIsOpen } = useSubscriptionDialog()

  return (
    <div className="flex flex-col gap-3">
      <div className="space-y-2">
        <BenefitItem text="Cloud Sync" />
        <BenefitItem text="Web App & Desktop App & Mobile App" />
        <BenefitItem text="Unlimited number of posts, pages, databases" />
        <BenefitItem text="One-to-One support in discord" />
      </div>

      <div className="mt-4">
        <Button
          size="lg"
          className="px-8 h-12 font-bold"
          onClick={() => {
            toast.info('coming soon....')
          }}
        >
          Become a member
        </Button>
      </div>

      <UseCouponCode></UseCouponCode>
    </div>
  )
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <Check className="text-green-500" />
      <div className="text-foreground/70">{text}</div>
    </div>
  )
}
