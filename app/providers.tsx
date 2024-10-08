'use client'

import { WalletConnectProvider } from '@/components/WalletConnectProvider'
import { trpc } from '@/lib/trpc'
import { StoreProvider } from '@/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { headers } from 'next/headers' // added

import { Toaster } from 'sonner'
import superjson from 'superjson'

const queryClient = new QueryClient()

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      // url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/trpc`,
      url: `/api/trpc`,
      transformer: superjson,
    }),
  ],
})

export function Providers({
  children,
  cookies,
}: {
  children: React.ReactNode
  cookies: string | null
}) {
  return (
    <WalletConnectProvider cookies={cookies}>
      <Toaster className="dark:hidden" />
      <Toaster theme="dark" className="hidden dark:block" />
      <trpc.Provider client={trpcClient} queryClient={queryClient as any}>
        <QueryClientProvider client={queryClient}>
          <StoreProvider>{children}</StoreProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </WalletConnectProvider>
  )
}
