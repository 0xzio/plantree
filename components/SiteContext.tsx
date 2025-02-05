'use client'

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { STATIC_URL } from '@/lib/constants'
import { Site } from '@prisma/client'

interface Features {
  journal: boolean
  gallery: boolean
  page: boolean
  database: boolean
}

export const SiteContext = createContext({} as Site)

interface Props {
  site: Site
}

export const SiteProvider = ({ site, children }: PropsWithChildren<Props>) => {
  useEffect(() => {
    window.__SITE__ = site
  }, [site])

  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>
}

export function useSiteContext() {
  const site = useContext(SiteContext)
  function formatLogo() {
    if (!site.logo) return ''
    if (site.logo.startsWith('/')) {
      return `${STATIC_URL}${site.logo}`
    }
    return site.logo
  }

  const { features } = (site.config || {}) as any as {
    features: Features
  }

  return {
    ...site,
    logo: formatLogo(),
  }
}
