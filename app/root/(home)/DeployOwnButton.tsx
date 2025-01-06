'use client'

import { useLoginDialog } from '@/components/LoginDialog/useLoginDialog'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function DeployOwnButton() {
  const { data } = useSession()
  const { setIsOpen } = useLoginDialog()
  const { push } = useRouter()
  return (
    <Button
      size="lg"
      className="h-14 text-base w-52 flex flex-col relative overflow-hidden"
      asChild
    >
      <Link href="/self-hosted" className="overflow-hidden">
        <div>Deploy my own</div>
        <div className="absolute top-0 right-0 text-xs bg-emerald-500 px-1 py-[1px] rounded-bl-lg">
          Recommend
        </div>
      </Link>
    </Button>
  )
}
