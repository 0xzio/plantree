import { useEffect, useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { Input } from '@/components/ui/input'
import { trpc } from '@/lib/trpc'
import { Box } from '@fower/react'
import { useDebouncedCallback } from 'use-debounce'
import { GithubConnectedBox } from './GitHubConnectedBox'
import { GithubInstallationSelect } from './GitHubInstallationSelect'
import { Repos } from './Repos'

interface Props {
  github: any
}

export function GitIntegration({ github }: Props) {
  const site = useSiteContext()
  const { data: installations, isLoading: isLoadInstallations } =
    trpc.github.appInstallations.useQuery({
      token: github?.token!,
    })

  const [installationId, setInstallationId] = useState('')

  const [q, setQ] = useState<string>('')
  const debouncedSetQ = useDebouncedCallback(async (val) => {
    return setQ(val)
  }, 500)

  useEffect(() => {
    if (installations?.length && !installationId) {
      setInstallationId(installations[0].installationId.toString())
    }
  }, [installations, installationId])

  if (isLoadInstallations) {
    return (
      <div className="h-40 flex items-center justify-center">
        <LoadingDots></LoadingDots>
      </div>
    )
  }

  if (site.repo) {
    return <GithubConnectedBox repo={site.repo} />
  }

  return (
    <Box mt2 column gapY4>
      <Box toBetween gapX3>
        <GithubInstallationSelect
          token={github?.token!}
          value={(installationId || '').toString()}
          onChange={(v: string) => setInstallationId(v)}
        />
        <Input
          placeholder="Search..."
          onChange={(e) => debouncedSetQ(e.target.value)}
        />
      </Box>
      {installationId && (
        <Repos
          token={github?.token!}
          q={q}
          installationId={Number(installationId)}
        />
      )}
    </Box>
  )
}
