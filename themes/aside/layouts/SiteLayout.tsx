import { ReactNode } from 'react'
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
      <main className="flex flex-1 w-full px-4 xl:px-0 gap-x-16 relative max-w-4xl mx-auto">
        <Sidebar site={site} tags={tags} />
        <div className="flex-1 pt-16">{children}</div>
      </main>
    </div>
  )
}
