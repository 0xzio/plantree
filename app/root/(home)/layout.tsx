import { PropsWithChildren } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Slogan } from './Slogan'
import { StartWritingButton } from './StartWritingButton'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24 * 365

export default async function HomePage({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col justify-center pt-5 md:pt-32 gap-4 relative pb-20">
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
        <Badge size="lg" variant="feature">
          Local-First
        </Badge>
      </div>
      <div className="flex items-center justify-center gap-2">
        <StartWritingButton />

        <Button size="lg" className="h-12 text-base w-36" asChild>
          <Link href="/self-hosted">Deploy my own</Link>
        </Button>
      </div>

      {children}
    </div>
  )
}
