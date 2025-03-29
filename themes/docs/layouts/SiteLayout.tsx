import { ReactNode } from 'react'
import { Footer } from '@/components/theme-ui/Footer'
import { Site } from '@/lib/theme.types'
import { Header } from '../components/Header'
import SectionContainer from '../components/SectionContainer'
import { Sidebar } from '../components/Sidebar'

interface Props {
  site: Site
  children: ReactNode
}

export function SiteLayout({ children, site }: Props) {
  return (
    <div>
      <Header site={site} />
      <main className="flex flex-1 w-full px-4 xl:px-0 gap-x-16 relative max-w-7xl mx-auto">
        <Sidebar site={site} className="hidden md:block" />
        <div className="flex-1">{children}</div>
        {/* <Footer site={site} /> */}
      </main>
    </div>
  )
}
