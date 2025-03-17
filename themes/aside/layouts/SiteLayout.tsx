import { ReactNode } from 'react'
import { Footer } from '@/components/theme-ui/Footer'
import { Site, Tag } from '@/lib/theme.types'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'

interface Props {
  site: Site
  tags: Tag[]
  children: ReactNode
}

export function SiteLayout({ children, site, tags }: Props) {
  return (
    <div>
      <Header site={site} className="px-4 md:hidden" />
      <main className="flex flex-1 w-full px-4 xl:px-0 gap-x-20 relative max-w-5xl mx-auto">
        <Sidebar site={site} tags={tags} />
        <div className="flex-1 pt-16 flex flex-col">
          <div className="flex-1">{children}</div>
          <Footer site={site} className="mt-auto" />
        </div>
      </main>
    </div>
  )
}
