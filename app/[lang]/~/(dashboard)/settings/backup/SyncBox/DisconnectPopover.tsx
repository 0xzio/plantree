import { useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Box } from '@fower/react'
import { PopoverClose } from '@radix-ui/react-popover'

interface Props {}

export function DisconnectPopover({}: Props) {
  const [loading, setLoading] = useState(false)

  return (
    <Popover>
      <PopoverTrigger>
        <Button>Disconnect</Button>
      </PopoverTrigger>
      <PopoverContent>
        <>
          <div>Sure to disconnect?</div>
          <div className="gap-x-3">
            <PopoverClose>Cancel</PopoverClose>
            <Button
              disabled={loading}
              onClick={async () => {
                setLoading(true)
                try {
                  // const user = await trpc.user.disconnectRepo.mutate({
                  //   address,
                  // })
                  // store.setUser(new User(user))
                  // close()
                } catch (error) {
                  // toast.warning('Disconnect GitHub failed')
                }

                setLoading(false)
              }}
            >
              {loading && <LoadingDots />}
              <Box>Confirm</Box>
            </Button>
          </div>
        </>
      </PopoverContent>
    </Popover>
  )
}
