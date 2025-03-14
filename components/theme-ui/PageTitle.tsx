import { ReactNode } from 'react';
import { cn } from '@/lib/utils';


interface Props {
  children: ReactNode
  className?: string
}

export function PageTitle({ children, className }: Props) {
  return (
    <h1
      className={cn(
        'text-3xl font-bold tracking-tight md:text-[42px] mt-12 mb-10 leading-tight',
        className,
      )}
    >
      {children}
    </h1>
  )
}