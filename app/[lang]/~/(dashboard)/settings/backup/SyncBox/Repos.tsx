import { LoadingDots } from '@/components/icons/loading-dots'
import { Card } from '@/components/ui/card'
import { trpc } from '@/lib/trpc'
import { Box } from '@fower/react'
import { LockKeyhole } from 'lucide-react'
import { GitHubConnectButton } from './GitHubConnectButton'

interface Props {
  token: string
  q: string
  installationId: number
}

export function Repos({ installationId, q, token }: Props) {
  const {
    data = [],
    isLoading,
    isFetching,
  } = trpc.github.searchRepo.useQuery({
    q,
    installationId: Number(installationId),
    token,
  })

  if (isLoading) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <div className="flex justify-center items-center gap-2">
          <div className="text-foreground/60">Loading repos</div>
          <LoadingDots className="bg-foreground" />
        </div>
      </Card>
    )
  }

  if (!data?.length) {
    return <Card className="h-96 flex items-center">No repos found</Card>
  }

  return (
    <Box column gap2 border borderGray100 mt2 roundedXL>
      {data.map((item) => (
        <Box
          key={item.id}
          toBetween
          toCenterY
          borderBottom
          borderBottomGray100
          px4
          py3
        >
          <Box toCenterY gap1>
            <Box textBase>{item.name}</Box>
            {item.private && (
              <Box gray600>
                <LockKeyhole size={16} />
              </Box>
            )}
          </Box>
          <GitHubConnectButton
            installationId={installationId}
            repo={item.full_name}
          />
        </Box>
      ))}
    </Box>
  )
}
