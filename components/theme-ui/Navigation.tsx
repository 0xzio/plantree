import { Link } from '@/lib/i18n'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'

interface Props {
  site: Site
  className?: string
}

export function Navigation({ site, className }: Props) {
  const links = [
    ...site?.navLinks,
    {
      pathname: '/creator-fi',
      title: 'CreatorFi',
      visible: true,
    },
  ]
  return (
    <div
      className={cn(
        'hidden md:flex md:flex-row flex-col md:items-start items-center gap-x-4 gap-y-2',
        className,
      )}
    >
      {links.map((link) => {
        if (link.pathname === '/creator-fi' && !site.spaceId) {
          return null
        }

        if (!link.visible) return null

        return (
          <Link
            key={link.pathname}
            href={link.pathname}
            className={cn(
              'font-medium hover:text-brand dark:hover:text-brand/80 text-foreground/90',
            )}
          >
            {link.title}
          </Link>
        )
      })}

      {site.spaceId && (
        <Link
          href="/membership"
          className={cn(
            'font-medium hover:text-brand text-foreground/90',
            'border border-brand text-brand rounded-full px-2 py-1 hover:bg-brand hover:text-background text-sm',
          )}
        >
          Membership
        </Link>
      )}
    </div>
  )
}
