'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Trans } from '@lingui/react/macro'
import { LoginDialogContent } from './LoginDialogContent'
import { RegisterForm } from './RegisterForm'
import { useAuthStatus } from './useAuthStatus'
import { useLoginDialog } from './useLoginDialog'

interface Props {}

export function LoginDialog({}: Props) {
  const { isOpen, setIsOpen } = useLoginDialog()
  const { authStatus } = useAuthStatus()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px] grid gap-4">
        {authStatus === 'login' && (
          <>
            <DialogHeader>
              <DialogTitle className="mb-4 text-2xl text-center">
                <Trans>Welcome to Plantree</Trans>
              </DialogTitle>
              <DialogDescription className="hidden"></DialogDescription>
            </DialogHeader>
            <LoginDialogContent />
          </>
        )}

        {authStatus === 'register' && (
          <div className="h-[290px]">
            <DialogHeader>
              <DialogTitle className="mb-6 text-2xl text-center">
                <Trans>Register to Plantree</Trans>
              </DialogTitle>
            </DialogHeader>
            <RegisterForm />
          </div>
        )}

        {authStatus === 'register-email-sent' && (
          <div className="h-[290px] flex flex-col">
            <DialogHeader>
              <DialogTitle className=""></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="flex-1 flex flex-col gap-4 justify-center item-center text-center">
              <h1 className="text-2xl font-semibold">
                <Trans>Email validate Link sent</Trans>
              </h1>
              <p className="text-green-500">
                <Trans>
                  Please check your email for the verification link.
                </Trans>
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
