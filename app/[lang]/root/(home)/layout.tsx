import { PropsWithChildren } from 'react'
import { SocialNav } from '@/components/SocialNav'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { initLingui } from '@/initLingui'
import { Link } from '@/lib/i18n'
import { DeployOwnButton } from './DeployOwnButton'
import { SiteCount } from './SiteCount'
import { Slogan } from './Slogan'
import { StartWritingButton } from './StartWritingButton'

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24 * 365

export default async function HomePage({
  children,
  params,
}: PropsWithChildren<{
  params: Promise<{ domain: string; lang: string }>
}>) {
  const lang = (await params).lang
  const locale = lang === 'pseudo' ? 'en' : lang
  initLingui(locale)
  return (
    <div className="flex flex-col justify-center pt-5 md:pt-32 gap-8 relative pb-20">
      <div>
        <SocialNav />
        <Slogan></Slogan>
      </div>
      {/* <div className="flex gap-2 justify-center mb-4 mx-8 sm:mx-0 flex-wrap">
        <Badge size="lg" variant="feature">
          Web3
        </Badge>

        <Badge size="lg" variant="feature">
          Blog tokenize
        </Badge>

        <Badge size="lg" variant="feature">
          own your data
        </Badge>

        <Badge size="lg" variant="feature">
          Modern
        </Badge>
      </div> */}
      <div className="flex items-center justify-center gap-3">
        <StartWritingButton />
        {/* <DeployOwnButton /> */}
      </div>

      {children}
    </div>
  )
}
