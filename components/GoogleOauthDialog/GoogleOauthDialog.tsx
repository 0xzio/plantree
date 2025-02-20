'use client'

import { useCallback, useEffect, useState } from 'react'
import { IconGoogle } from '@/components/icons/IconGoogle'
import LoadingCircle from '@/components/icons/loading-circle'
import { LoadingDots } from '@/components/icons/loading-dots'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getGoogleUserInfo } from '@/lib/getGoogleUserInfo'
import { useSession } from '@/lib/useSession'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useGoogleOauthDialog } from './useGoogleOauthDialog'

export function GoogleOauthDialog() {
  const { isOpen, setIsOpen } = useGoogleOauthDialog()
  const searchParams = useSearchParams()
  const authType = searchParams?.get('auth_type')
  const { login } = useSession()

  const loginWithGoogle = useCallback(
    async function () {
      const accessToken = searchParams?.get('access_token')!
      try {
        const info = await getGoogleUserInfo(accessToken)
        console.log('=====info:', info)

        const result = await login({
          type: 'penx-google',
          email: info.email,
          openid: info.sub,
          picture: info.picture,
          name: info.name,
        })

        console.log('=====result:', result)
      } catch (error) {
        console.log('>>>>>>>>>>>>erorr:', error)
        toast.error('Failed to sign in with Google. Please try again.')
      }

      console.log(
        '=====`${location.origin}/${location.pathname}`:',
        `${location.origin}/${location.pathname}`,
      )

      location.href = `${location.origin}/${location.pathname}`
    },
    [searchParams, login],
  )

  useEffect(() => {
    if (authType === 'google' && !isOpen) {
      setIsOpen(true)
      loginWithGoogle()
    }
  }, [authType, isOpen, setIsOpen, searchParams, loginWithGoogle])

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogTitle className="hidden">
        <DialogDescription></DialogDescription>
      </DialogTitle>
      <DialogContent
        closable={false}
        className="h-64 flex items-center justify-center w-[90%] sm:max-w-[425px] rounded-xl focus-visible:outline-none"
      >
        <IconGoogle className="w-6 h-6" />
        <div className="text-lg">Logging in</div>
        <LoadingDots className="bg-foreground/60" />
      </DialogContent>
    </Dialog>
  )
}
