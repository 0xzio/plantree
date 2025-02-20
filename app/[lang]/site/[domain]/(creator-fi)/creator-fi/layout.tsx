import { ReactNode } from 'react'

export const dynamic = 'force-static'
export const revalidate = 86400; // 3600 * 24

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="mx-auto w-full">{children}</div>
    </div>
  )
}
