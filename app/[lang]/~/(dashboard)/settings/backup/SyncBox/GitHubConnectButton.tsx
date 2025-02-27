import { useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { Box } from '@fower/react'
import { toast } from 'sonner'

interface Props {
  installationId: number
  repo: string
}

export function GitHubConnectButton({ installationId, repo }: Props) {
  const [loading, setLoading] = useState(false)

  async function connect() {
    setLoading(true)
    try {
      // const user = await trpc.user.connectRepo.mutate({
      //   address,
      //   installationId,
      //   repo,
      // })
      // store.setUser(new User(user))
    } catch (error) {
      toast.warning('Connect GitHub failed')
    }
    setLoading(false)
  }

  return (
    <Button size="sm" disabled={loading} onClick={connect}>
      {loading && <LoadingDots />}
      <Box>Connect</Box>
    </Button>
  )
}
