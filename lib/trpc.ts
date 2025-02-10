'use client'

import { AppRouter } from '@/server/_app'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { get } from 'idb-keyval'
import superjson from 'superjson'
import { CURRENT_SITE } from './constants'

const link = httpBatchLink({
  url: `/api/trpc`,
  transformer: superjson,
  async headers() {
    const site = await get(CURRENT_SITE)
    if (site?.id) {
      return {
        'X-ACTIVE-SITE-ID': site?.id,
      }
    } else {
      return {}
    }
  },
})

export const api = createTRPCClient<AppRouter>({
  links: [link],
})

export const trpc = createTRPCReact<AppRouter>({})

export const trpcClient = trpc.createClient({
  links: [link],
})
