'use client'

import { Suspense } from 'react'
import { FrameProvider } from '@/components/FrameProvider'
import { GoogleOauthDialog } from '@/components/GoogleOauthDialog/GoogleOauthDialog'
import { LoginDialog } from '@/components/LoginDialog/LoginDialog'
import { ROOT_DOMAIN } from '@/lib/constants'
import { queryClient } from '@/lib/queryClient'
import { trpc, trpcClient } from '@/lib/trpc'
import { wagmiConfig } from '@/lib/wagmi/wagmiConfig'
import { StoreProvider } from '@/store'
import { AuthKitProvider } from '@farcaster/auth-kit'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { WagmiProvider } from 'wagmi'
import { RainbowKitSiweProvider } from './RainbowKitSiweProvider'

function RainbowProvider({ children }: { children: React.ReactNode }) {
  return (
    <RainbowKitSiweProvider>
      <RainbowKitProvider>
        <StoreProvider>
          <GoogleOauthDialog />
          {children}
        </StoreProvider>
      </RainbowKitProvider>
    </RainbowKitSiweProvider>
  )
}

export function Providers({
  children,
  cookies,
}: {
  children: React.ReactNode
  cookies: string | null
}) {
  return (
    <>
      <Toaster className="dark:hidden" richColors />
      <Toaster theme="dark" className="hidden dark:block" richColors />
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <AuthKitProvider
          config={{
            // relay: 'https://relay.farcaster.xyz',
            rpcUrl: 'https://mainnet.optimism.io',
            domain: ROOT_DOMAIN,
            siweUri: `https://${ROOT_DOMAIN}`,
          }}
        >
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <FrameProvider>
                <RainbowProvider>{children}</RainbowProvider>
              </FrameProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </AuthKitProvider>
      </trpc.Provider>
    </>
  )
}
