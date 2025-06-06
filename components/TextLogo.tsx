import { cn } from '@/lib/utils'
import { Philosopher } from 'next/font/google'

const logoFont = Philosopher({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

interface Props {
  className?: string
}

export function TextLogo({ className }: Props) {
  return (
    <div
      className={cn('font-bold text-2xl flex', logoFont.className, className)}
    >
      <span className="">Plantree</span>
    </div>
  )
}
