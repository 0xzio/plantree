import { trpc } from '@/lib/trpc'

export function useAccessTokens() {
  return trpc.accessToken.list.useQuery()
}
