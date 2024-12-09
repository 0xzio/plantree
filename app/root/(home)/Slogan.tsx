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
      <div className="text-6xl md:text-7xl leading-none md:leading-tight font-bold space-y-2 text-foreground">
        Next Generation
        <br />
        blogging Tools
      </div>

      <div className="text-xl text-foreground/60">
        The new way to build individual blog.
      </div>
    </div>
  )
}
