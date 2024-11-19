import { PropsWithChildren } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slogan } from './Slogan'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24 * 365

export default async function HomePage({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col justify-center pt-5 md:pt-32 gap-4 relative pb-20">
      <Slogan></Slogan>
      <div className="flex gap-2 justify-center mb-4">
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
      <div className="flex flex-col items-center justify-center gap-1">
        <Button size="lg" className="h-12 text-base" asChild>
          <a href="https://docs.penx.io/deploy-in-10-minutes" target="_blank">
            Deploy in 10 minutes
          </a>
        </Button>
      </div>

      {children}
    </div>
  )
}
