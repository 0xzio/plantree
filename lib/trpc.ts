'use client'

// import type { AppRouter } from '@sponsor3/api'
import { AppRouter } from '@/server/_app'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import superjson from 'superjson'

export const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      // url: `${process.env.NEXT_PUBLIC_API_HOST}/api/trpc`,
      url: `/api/trpc`,
      transformer: superjson,
    }),
  ],
})

export const trpc = createTRPCReact<AppRouter>({})
