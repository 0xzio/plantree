'use client'

import { trpc } from '@/lib/trpc'
import { wagmiConfig } from '@/lib/wagmi/wagmiConfig'
import { StoreProvider } from '@/store'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from '@rainbow-me/rainbowkit-siwe-next-auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import superjson from 'superjson'
import { Config, cookieToInitialState, State, WagmiProvider } from 'wagmi'

const queryClient = new QueryClient()

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `/api/trpc`,
      transformer: superjson,
    }),
  ],
})

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in with ethereum',
})

export function Providers({
  children,
  cookies,
}: {
  children: React.ReactNode
  cookies: string | null
}) {
  const initialState = cookieToInitialState(wagmiConfig as Config, cookies)

  return (
    <SessionProvider refetchInterval={0}>
      <Toaster className="dark:hidden" />
      <Toaster theme="dark" className="hidden dark:block" />
      <trpc.Provider client={trpcClient} queryClient={queryClient as any}>
        <WagmiProvider config={wagmiConfig} initialState={initialState}>
          <QueryClientProvider client={queryClient}>
            {/* <RainbowKitSiweNextAuthProvider
              getSiweMessageOptions={getSiweMessageOptions}
            > */}
            <RainbowKitProvider>
              <StoreProvider>{children}</StoreProvider>
            </RainbowKitProvider>
            {/* </RainbowKitSiweNextAuthProvider> */}
          </QueryClientProvider>
        </WagmiProvider>
      </trpc.Provider>
    </SessionProvider>
  )
}
