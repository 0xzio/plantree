import { ReactNode } from 'react'
import { SiteLink } from '@/components/SiteLink'
import { PostsNav } from './PostsNav'

export const dynamic = 'force-static'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8 p-3 md:p-0 overflow-hidden">
      <div className="flex-col md:flex-row flex md:items-center gap-2">
        <div className="text-3xl font-bold">Your Post</div>
        <SiteLink></SiteLink>
      </div>
      <PostsNav />
      {children}
    </div>
  )
}
