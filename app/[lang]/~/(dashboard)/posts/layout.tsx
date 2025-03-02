import { ReactNode } from 'react'
import { SiteLink } from '@/components/SiteLink'
import { CreatePostButton } from './components/CreatePostButton'
import { PostsNav } from './components/PostsNav'

export const dynamic = 'force-static'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8 p-3 md:p-0">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">Your Posts</div>
          <CreatePostButton />
        </div>
        <div>
          <SiteLink></SiteLink>
        </div>
      </div>
      <PostsNav />
      {children}
    </div>
  )
}
