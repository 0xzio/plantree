import { cn } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { Merienda, Poppins } from 'next/font/google'

const merienda = Merienda({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
})

export function Slogan() {
  return (
    <div className="space-y-3 text-center">
      <div className="text-5xl md:text-6xl leading-none md:leading-tight font-bold space-y-2 text-foreground">
        <div className="">
          <Trans>
            Build your own <span className="text-brand">Digital Garden</span>
          </Trans>
        </div>
      </div>

      <div className="text-xl mx-auto max-w-lg text-foreground/80">
        <Trans>Plantree is a tool for building a digital garden.</Trans>
        <br />
        <Trans>
          Having your own garden, start planting, and watch it grow.
        </Trans>
      </div>
    </div>
  )
}
