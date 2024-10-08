import { cn } from '@/lib/utils'
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
    <div className="space-y-2">
      <div className="text-4xl leading-normal font-bold space-y-2">
        <div
          className={cn(
            'font-semibold leading-none md:leading-tight',
            poppins.className,
          )}
        >
          The best time to plant a tree was 20 years ago, <br /> The second-best
          time is now.
        </div>
      </div>
    </div>
  )
}
