import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useSidebarSheet } from './useSidebarSheet'

interface SidebarItemProps {
  label: ReactNode
  icon: ReactNode
  isActive?: boolean
  children?: ReactNode
  onClick?: () => void
}

export const SidebarItem = ({
  icon,
  label,
  isActive,
  onClick,
  children,
  ...rest
}: SidebarItemProps) => {
  const { setIsOpen } = useSidebarSheet()
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 rounded px-2 text-foreground/80 hover:bg-foreground/5 h-8 transition-all cursor-pointer text-[15px] font-medium',
        isActive && 'text-foreground bg-foreground/5',
      )}
      {...rest}
      onClick={() => {
        setIsOpen(false)
        onClick && onClick()
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn('text-foreground/80', isActive && 'text-foreground')}
        >
          {icon}
        </div>
        <div>{label}</div>
      </div>
      {children}
    </div>
  )
}
