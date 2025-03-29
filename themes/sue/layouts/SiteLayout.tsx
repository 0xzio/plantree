import { ReactNode } from 'react'
import { Footer } from '@/components/theme-ui/Footer'
import { Site } from '@/lib/theme.types'
import { Header } from '../components/Header'
import SectionContainer from '../components/SectionContainer'

interface Props {
  site: Site
  children: ReactNode
}

export function SiteLayout({ children, site }: Props) {
  return (
    <SectionContainer>
      <Header site={site} />
      <main
        className="mb-auto px-4 mx-auto pt-0 sm:pt-20 w-full max-w-2xl"
        style={
          {
            '--header-height': '60px',
          } as any
        }
      >
        {children}
      </main>
      <Footer site={site} />
    </SectionContainer>
  )
}
