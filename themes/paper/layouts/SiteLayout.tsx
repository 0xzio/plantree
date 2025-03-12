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
    <SectionContainer className="py-0 px-0 md:py-[80px]">
      <div className="mx-auto w-full md:w-3xl bg-background px-10 md:shadow rounded min-h-screen md:max-h-[calc(100vh - 160px)]">
        <Header site={site} />
        <main className="mb-auto">{children}</main>
        <Footer site={site} className="mt-auto" />
      </div>
    </SectionContainer>
  )
}
