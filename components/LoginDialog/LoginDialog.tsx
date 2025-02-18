'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
              <DialogTitle className="">Login</DialogTitle>
              <DialogDescription>Login to write post</DialogDescription>
            </DialogHeader>
            <LoginDialogContent />
          </>
        )}

        {authStatus === 'register' && (
          <div className="h-[290px]">
            <DialogHeader>
              <DialogTitle className="">Register</DialogTitle>
              <DialogDescription>Register to write post</DialogDescription>
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
                Email validate Link sent
              </h1>
              <p className="text-green-500">
                Please check your email for the verification link.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
