'use client'

import { AppRouter } from '@/server/_app'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { get } from 'idb-keyval'
import superjson from 'superjson'

const link = httpBatchLink({
  url: `/api/trpc`,
  transformer: superjson,
  async headers() {
    // console.log('=======window.__SITE_ID__:', window.__SITE_ID__)

    if (window.__SITE_ID__ && window.__SITE__) {
      return {
        'X-ACTIVE-SITE-ID': window.__SITE_ID__ || window.__SITE__?.id,
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
