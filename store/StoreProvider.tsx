'use client'

import { PropsWithChildren, useEffect } from 'react'
import { setLocalSession } from '@/lib/local-session'
import { useSession } from '@/lib/useSession'
import { Provider } from 'jotai'
import { usePathname } from '@/lib/i18n'
import { useAccount, useDisconnect } from 'wagmi'
import { JotaiNexus } from './JotaiNexus'
import { store } from './store'

export function StoreProvider(props: PropsWithChildren) {
  const { status, data: session } = useSession()
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const pathname = usePathname()

  useEffect(() => {
    if (session) {
      window.__USER_ID__ = session.userId
    } else {
      window.__USER_ID__ = undefined as any
    }
  }, [session])

  useEffect(() => {
    setLocalSession(session as any)
  }, [session])

  return (
    <Provider store={store}>
      <JotaiNexus />
      {props.children}
    </Provider>
  )
}
