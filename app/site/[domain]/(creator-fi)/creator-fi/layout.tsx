'use client'

import { ReactNode } from 'react'

export const dynamic = 'force-static'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="mx-auto w-full">{children}</div>
    </div>
  )
}
