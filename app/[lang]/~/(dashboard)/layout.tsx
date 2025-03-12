import { ReactNode } from 'react'
import { initLingui } from '@/initLingui'
import linguiConfig from '@/lingui.config'
import NextTopLoader from 'nextjs-toploader'
import { DashboardLayout } from './DashboardLayout'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }))
}

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ domain: string; lang: string }>
}) {
  const lang = (await params).lang
  const locale = lang === 'pseudo' ? 'en' : lang
  initLingui(locale)
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
