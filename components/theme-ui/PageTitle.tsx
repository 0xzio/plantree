import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  className?: string
}

export function PageTitle({ children, className }: Props) {
  return (
    <h1
      className={cn(
        'text-4xl font-bold tracking-tight sm:leading-10 md:text-5xl mt-12 mb-10',
        className,
      )}
    >
      {children}
    </h1>
  )
}
