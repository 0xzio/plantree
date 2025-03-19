import { ReactNode } from 'react'
import { Link } from '@/lib/i18n'
import { NavLink } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'

interface Props {
  link: NavLink
  className?: string
}

export function NavigationItem({ link, className }: Props) {
  let title = link.title as ReactNode
  if (link.pathname === '/') title = <Trans>Home</Trans>
  if (link.pathname === '/posts') title = <Trans>Blog</Trans>
  if (link.pathname === '/projects') title = <Trans>Projects</Trans>
  if (link.pathname === '/friends') title = <Trans>Friends</Trans>
  if (link.pathname === '/ama') title = <Trans>AMA</Trans>
  if (link.pathname === '/guestbook') title = <Trans>Guestbook</Trans>
  if (link.pathname === '/tags') title = <Trans>Tags</Trans>
  if (link.pathname === '/about') title = <Trans>About</Trans>

  return (
    <Link
      key={link.pathname}
      href={link.pathname}
      className={cn(
        'text-base hover:text-brand dark:hover:text-brand/80 text-foreground/90 leading-none shrink-0 flex justify-center',
        className,
      )}
    >
      {title}
    </Link>
  )
}
