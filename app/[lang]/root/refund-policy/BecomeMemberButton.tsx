'use client'

import { useLoginDialog } from '@/components/LoginDialog/useLoginDialog'
import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/useSession'
import { useRouter } from '@/lib/i18n'

export function BecomeMemberButton() {
  const { setIsOpen } = useLoginDialog()
  const { data } = useSession()
  const { push } = useRouter()

  return (
    <Button
      size="lg"
      className="rounded-full px-8 h-12 font-bold"
      onClick={() => {
        if (!data) {
          setIsOpen(true)
        } else {
          push('/~/settings/subscription')
        }
      }}
    >
      Become a member
    </Button>
  )
}
