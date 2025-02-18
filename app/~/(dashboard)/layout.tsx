import { ReactNode } from 'react'
import NextTopLoader from 'nextjs-toploader'
import { DashboardLayout } from './DashboardLayout'

export const dynamic = 'force-static'

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <NextTopLoader
        color="#000"
        // crawlSpeed={0.08}
        height={2}
        showSpinner={false}
        template='<div class="bar" role="bar"><div class="peg"></div></div>'
      />

      <DashboardLayout>{children}</DashboardLayout>
    </>
  )
}
