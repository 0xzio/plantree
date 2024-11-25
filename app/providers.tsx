'use client'

import { Suspense } from 'react'
import { GoogleOauthDialog } from '@/components/GoogleOauthDialog/GoogleOauthDialog'
import { ROOT_DOMAIN } from '@/lib/constants'
import { trpc, trpcClient } from '@/lib/trpc'
import { wagmiConfig } from '@/lib/wagmi/wagmiConfig'
import { StoreProvider } from '@/store'
import { AuthKitProvider } from '@farcaster/auth-kit'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from '@rainbow-me/rainbowkit-siwe-next-auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { WagmiProvider } from 'wagmi'

const queryClient = new QueryClient()

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
  return (
    <SessionProvider refetchInterval={0}>
      <Toaster className="dark:hidden" />
      <Toaster theme="dark" className="hidden dark:block" />
      <Suspense>
        <GoogleOauthDialog />
      </Suspense>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <AuthKitProvider
          config={{
            // relay: 'https://relay.farcaster.xyz',
            rpcUrl: 'https://mainnet.optimism.io',
            domain: ROOT_DOMAIN,
            siweUri: `https://${ROOT_DOMAIN}/login`,
          }}
        >
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitSiweNextAuthProvider
                getSiweMessageOptions={getSiweMessageOptions}
              >
                <RainbowKitProvider>
                  <StoreProvider>{children}</StoreProvider>
                </RainbowKitProvider>
              </RainbowKitSiweNextAuthProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </AuthKitProvider>
      </trpc.Provider>
    </SessionProvider>
  )
}
