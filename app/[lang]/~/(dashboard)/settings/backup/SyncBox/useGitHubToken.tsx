import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

export function useGitHubToken() {
  const { data: github, ...rest } = useQuery(['githubToken'], () =>
    trpc.github.githubInfo.query({ address }),
  )

  const isTokenValid = useMemo(() => {
    if (!github) return false
    return !!github.token
  }, [github])

  return {
    isTokenValid: false,
    github: {},
    // token: github?.token,
    token: '',
    // ...rest,
  }
}
