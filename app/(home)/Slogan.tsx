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
      <div className="text-6xl leading-tight font-extrabold space-y-2">
        Build your own <br />
        <div className="bg-gradient-to-r from-orange-500  to-pink-500 bg-clip-text text-transparent">
          web3 individual blog
        </div>
      </div>

      <div className="text-xl text-foreground/60">
        The best way to build web3 individual blog.
      </div>
    </div>
  )
}
