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
          <Trans>Modern blogging tools</Trans>
        </div>
      </div>

      <div className="text-xl mx-auto max-w-lg text-foreground/80">
        <Trans>
          PenX is a modern blogging tool. AI-native, beautiful out-of-the-box,
          and built for creators.
        </Trans>
      </div>
    </div>
  )
}
