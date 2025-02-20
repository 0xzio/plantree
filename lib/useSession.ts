'use client'

import { useMemo } from 'react'
import {
  GoogleLoginData,
  LoginData,
  SessionData,
  UpdateActiveSiteData,
  UpdateSessionData,
} from '@/lib/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from './queryClient'

const sessionApiRoute = '/api/session'

async function fetchJson<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  return fetch(input, {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    ...init,
  }).then((res) => res.json())
}

export function useSession() {
  const { isPending, data: session } = useQuery({
    queryKey: ['session'],
    queryFn: () => fetchJson<SessionData>(sessionApiRoute),
  })

  async function login(data: LoginData) {
    const res = await fetchJson<SessionData>(sessionApiRoute, {
      body: JSON.stringify(data),
      method: 'POST',
    })

    queryClient.setQueriesData({ queryKey: ['session'] }, res)
    return res
  }

  async function logout() {
    const res = await fetchJson<SessionData>(sessionApiRoute, {
      method: 'DELETE',
    })

    queryClient.setQueriesData({ queryKey: ['session'] }, res)
  }

  const status = useMemo(() => {
    if (isPending) return 'loading'
    if (!session?.isLoggedIn) return 'unauthenticated'
    if (session?.isLoggedIn) return 'authenticated'
    return 'loading'
  }, [isPending, session]) as 'loading' | 'unauthenticated' | 'authenticated'

  async function update(data: UpdateSessionData) {
    const res = await fetchJson<SessionData>(sessionApiRoute, {
      body: JSON.stringify(data),
      method: 'PATCH',
    })
  }

  return {
    session: session?.isLoggedIn ? session : undefined,
    data: session?.isLoggedIn ? session : undefined,
    logout,
    login,
    status,
    update,
    isLoading: isPending,
    subscriptions: [] as any,
  }
}
