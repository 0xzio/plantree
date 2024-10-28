import { PropsWithChildren } from 'react'
import { Button } from '@/components/ui/button'
import { Slogan } from './Slogan'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24 * 365

export default async function HomePage({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col justify-center pt-5 md:pt-20 gap-8 relative pb-20">
      <Slogan></Slogan>
      <div className="flex flex-col items-center justify-center gap-1">
        <Button size="lg" className="h-12 text-base" asChild>
          <a href="https://docs.plantree.xyz/getting-started" target="_blank">
            Deploy a blog
          </a>
        </Button>
        <div className="text-sm text-foreground/40">
          Deploy a blog for free in 10 minutes
        </div>
      </div>

      {children}
    </div>
  )
}
