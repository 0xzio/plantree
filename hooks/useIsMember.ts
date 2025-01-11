import { useSession } from 'next-auth/react'

export function useIsMember() {
  const { data } = useSession()
  if (!data) return false
  if (!data.subscriptionEndedAt) return false
  const endedAt = new Date(data.subscriptionEndedAt).getTime()
  return endedAt > Date.now()
}
