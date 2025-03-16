import { ReactNode } from 'react'
import { PostNav } from '@/components/Post/PostNav'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-12 relative w-full">
      <PostNav />
      <div className="w-full">{children}</div>
    </div>
  )
}
