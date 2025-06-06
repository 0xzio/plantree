'use client'

import { useLoginDialog } from '@/components/LoginDialog/useLoginDialog'
import { Button } from '@/components/ui/button'
import { Link, useRouter } from '@/lib/i18n'
import { useSession } from '@/lib/useSession'
import { Trans } from '@lingui/react/macro'

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
        <div>
          <Trans>Deploy my own</Trans>
        </div>
        {/* <div className="absolute top-0 right-0 text-xs bg-emerald-500 px-1 py-[] rounded-bl-lg text-white">
        <Trans>Recommend</Trans>
          
        </div> */}
      </Link>
    </Button>
  )
}
