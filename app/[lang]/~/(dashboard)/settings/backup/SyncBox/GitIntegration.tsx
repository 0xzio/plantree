import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { useDebouncedCallback } from 'use-debounce'
import { GithubConnectedBox } from './GitHubConnectedBox'
import { GithubInstallationSelect } from './GitHubInstallationSelect'
import { Repos } from './Repos'

interface Props {
  github: any
}

export function GitIntegration({ github }: Props) {
  // const { data: installations } = useQuery(['appInstallations'], () =>
  //   trpc.github.appInstallations.query({
  //     token: github?.token!,
  //   }),
  // )

  const [installationId, setInstallationId] = useState<number>()
  const [q, setQ] = useState<string>('')
  const debouncedSetQ = useDebouncedCallback(async (val) => {
    return setQ(val)
  }, 500)

  // useEffect(() => {
  //   if (installations?.length && !installationId) {
  //     setInstallationId(installations[0].installationId)
  //   }
  // }, [installations, installationId])

  // const repo = user.repo

  // if (repo) {
  //   return <GithubConnectedBox repo={repo} />
  // }

  return (
    <Box mt2 column gapY4>
      <Box toBetween gapX3>
        <GithubInstallationSelect
          token={github?.token!}
          value={installationId!}
          onChange={(v: number) => setInstallationId(v)}
        />
        <Input
          placeholder="Search..."
          flex-1
          onChange={(e) => debouncedSetQ(e.target.value)}
        />
      </Box>
      {installationId && (
        <Repos token={github?.token!} q={q} installationId={installationId} />
      )}
    </Box>
  )
}
