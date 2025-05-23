'use client'

import { useMemo } from 'react'
import {
  GoogleLoginData,
  LoginData,
  SessionData,
  UpdateActiveSiteData,
  UpdateSessionData,
} from '@/lib/types'
import { BillingCycle, PlanType } from '@prisma/client'
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

  async function login(data: LoginData & { host?: string }) {
    const res = await fetchJson<SessionData>(sessionApiRoute, {
      body: JSON.stringify({
        ...data,
        host: location.host,
      }),
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
    queryClient.setQueriesData({ queryKey: ['session'] }, res)
  }

  const formattedSession = useMemo(() => {
    if (!session?.isLoggedIn) return undefined
    let planType = session.planType

    const isBeliever =
      session.believerPeriodEnd &&
      new Date(session.believerPeriodEnd).getTime() > Date.now()

    if (
      session.currentPeriodEnd &&
      Date.now() > new Date(session.currentPeriodEnd).getTime() &&
      !isBeliever
    ) {
      planType = PlanType.FREE
    }

    const isFree = planType === PlanType.FREE
    const isPro = planType === PlanType.PRO
    const isBasic = planType === PlanType.BASIC

    const isSubscription = [BillingCycle.MONTHLY, BillingCycle.YEARLY].includes(
      session?.billingCycle as any,
    )

    return {
      ...session,
      planType,
      isFree,
      isBeliever,
      isSubscription,
      isPro,
      isBasic,
    }
  }, [session])

  return {
    session: formattedSession,
    data: formattedSession,
    logout,
    login,
    status,
    update,
    isLoading: isPending,
    subscriptions: [] as any,
  }
}
