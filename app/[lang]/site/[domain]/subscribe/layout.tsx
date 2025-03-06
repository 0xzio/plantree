'use client'

import { useEthBalance, useQueryEthBalance } from '@/hooks/useEthBalance'
import { useQueryEthPrice } from '@/hooks/useEthPrice'

export default function Layout({ children }: { children: React.ReactNode }) {
  useQueryEthPrice()
  useQueryEthBalance()

  return <>{children}</>
}
