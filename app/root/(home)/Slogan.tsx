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
    <div className="space-y-6 text-center">
      <div className="text-7xl md:text-8xl leading-none md:leading-tight font-bold space-y-2 text-foreground">
        <div className="text-5xl md:text-6xl">Next Generation</div>
        <div>Blogging Tools</div>
      </div>

      <div className="text-xl text-foreground/60">
        A new way to build individual blog.
      </div>
    </div>
  )
}
