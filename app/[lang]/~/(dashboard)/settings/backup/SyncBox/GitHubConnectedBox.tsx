import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useSiteContext } from '@/components/SiteContext'
import { Github } from '@/components/theme-ui/SocialIcon/icons'
import { Button } from '@/components/ui/button'
import { queryClient } from '@/lib/queryClient'
import { api } from '@/lib/trpc'
import { Box } from '@fower/react'
import { ExternalLink, Link } from 'lucide-react'

interface Props {
  repo: string
}

export function GithubConnectedBox({ repo }: Props) {
  const site = useSiteContext()
  return (
    <div className="flex items-center justify-between border border-foreground/10 rounded-xl p-4">
      <Box toCenterY gap2>
        <Github className="w-6 h-6" />
        <Box textBase>{repo}</Box>
        <Box as="a" href={`https://github.com/${repo}`} target="_blank">
          <ExternalLink size={16} />
        </Box>
      </Box>
      <ConfirmDialog
        title="Sure to disconnect?"
        content="Are you sure you want to disconnect?"
        onConfirm={async () => {
          await api.github.disconnectRepo.mutate()
          queryClient.setQueriesData(
            { queryKey: ['current_site'] },
            {
              ...site,
              installationId: null,
              repo: '',
            },
          )
        }}
      >
        <Button variant="outline">Disconnect</Button>
      </ConfirmDialog>
    </div>
  )
}
