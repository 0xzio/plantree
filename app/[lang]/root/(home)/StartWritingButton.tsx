'use client'

import { useLoginDialog } from '@/components/LoginDialog/useLoginDialog'
import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/useSession'
import { useRouter } from '@/lib/i18n'

export function StartWritingButton() {
  const { data } = useSession()
  const { setIsOpen } = useLoginDialog()
  const { push } = useRouter()
  return (
    <div className="relative flex flex-col gap-1">
      <Button
        size="lg"
        className="h-14 text-base w-52 relative overflow-hidden"
        variant="outline-solid"
        onClick={() => {
          if (data) {
            push('/~/posts')
          } else {
            setIsOpen(true)
          }
        }}
      >
        <div>Writing on PenX cloud</div>
        {/* <div className="absolute top-0 right-0 text-xs bg-yellow-500 px-1 py-[1px] rounded-bl-lg text-white">
          Beta now
        </div> */}
      </Button>
    </div>
  )
}
