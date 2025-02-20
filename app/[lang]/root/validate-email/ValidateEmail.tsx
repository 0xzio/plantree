'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { trpc } from '@/lib/trpc'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

export function ValidateEmail() {
  const searchParams = useSearchParams()
  const { data } = useSession()
  const inited = useRef(false)

  const login = useCallback(
    async function () {
      const token = searchParams?.get('token') as string
      try {
        const result = await signIn('register-by-email', {
          validateToken: token,
          redirect: false,
        })

        console.log('=====result:', result)

        if (!result?.ok) {
          toast.error('Failed to register. Please try again')
        }
      } catch (error) {
        console.log('>>>>>>>>>>>>erorr:', error)
        toast.error('Failed to register. Please try again')
      }

      location.href = `${location.origin}/~/posts`
    },
    [searchParams],
  )

  useEffect(() => {
    if (inited.current) return
    inited.current = true
    login()
  }, [searchParams, login])

  return (
    <div className="p-10 h-[80vh] flex items-center justify-center flex-col">
      <div className="text-3xl font-bold">Creating new PenX account...</div>

      <div className="flex items-center justify-center mt-6">
        <LoadingDots className="bg-foreground" />
      </div>
    </div>
  )
}
