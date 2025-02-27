import { useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { queryClient } from '@/lib/queryClient'
import { api } from '@/lib/trpc'
import { Box } from '@fower/react'
import { toast } from 'sonner'

interface Props {
  installationId: number
  repo: string
}

export function GitHubConnectButton({ installationId, repo }: Props) {
  const [loading, setLoading] = useState(false)
  const site = useSiteContext()

  async function connect() {
    setLoading(true)
    try {
      await api.github.connectRepo.mutate({
        installationId,
        repo,
      })

      queryClient.setQueriesData(
        { queryKey: ['current_site'] },
        {
          ...site,
          installationId,
          repo,
        },
      )
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
