import { PropsWithChildren } from 'react'
import { SocialNav } from '@/components/SocialNav'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { DeployOwnButton } from './DeployOwnButton'
import { Slogan } from './Slogan'
import { StartWritingButton } from './StartWritingButton'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24 * 365

export default async function HomePage({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col justify-center pt-5 md:pt-32 gap-4 relative pb-20">
      <SocialNav />
      <Slogan></Slogan>
      <div className="flex gap-2 justify-center mb-4 mx-8 sm:mx-0 flex-wrap">
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
      </div>
      <div className="flex items-center justify-center gap-3">
        <StartWritingButton />
        <DeployOwnButton />
      </div>

      {children}
    </div>
  )
}
