'use client'

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { appEmitter } from '@/lib/app-emitter'
import { isServer } from '@/lib/constants'
import { runWorker } from '@/lib/worker'
import { Site } from '@penxio/types'

let inited = false
if (!isServer) {
  setTimeout(() => {
    if (inited) return
    inited = true
    runWorker()
  }, 2000)
}

export const SiteContext = createContext({} as Site)

interface Props {
  site: Site
}

export const SiteProvider = ({
  site: propSite,
  children,
}: PropsWithChildren<Props>) => {
  const [site, setSite] = useState<Site>(propSite)
  useEffect(() => {
    window.__SITE__ = site
  }, [site])

  useEffect(() => {
    appEmitter.on('SITE_UPDATED', (newSite) => {
      setSite(newSite)
    })
  }, [])

  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>
}

export function useSiteContext() {
  return useContext(SiteContext)
}
