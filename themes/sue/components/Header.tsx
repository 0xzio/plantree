import { Profile } from '@/components/Profile/Profile'
import { Airdrop } from '@/components/theme-ui/Airdrop'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import Link from './Link'

interface Props {
  site: Site
}

export const Header = ({ site }: Props) => {
  const links = [
    ...site?.navLinks,
    {
      pathname: '/creator-fi',
      title: 'CreatorFi',
      visible: true,
    },
  ]
  return (
    <header
      className={cn(
        'flex items-center justify-between px-6 py-4 h-12 z-40 sticky top-0 bg-background',
      )}
    >
      <Link href="/" className="font-bold text-xl min-w-60 cursor-pointer">
        {site.name}
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        <div className="no-scrollbar hidden items-center space-x-4 overflow-x-auto sm:flex sm:space-x-6">
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
                  'font-medium text-sm hover:text-brand-500 dark:hover:text-brand-400 text-foreground/90',
                )}
              >
                {link.title}
              </Link>
            )
          })}
        </div>

        {site.spaceId && (
          <Link
            href="/membership"
            className={cn(
              'font-medium hover:text-brand-500 text-foreground/90',
              'border border-brand-500 text-brand-500 rounded-full px-2 py-1 hover:bg-brand-500 hover:text-background text-sm',
            )}
          >
            Membership
          </Link>
        )}
      </div>

      <div className="flex item-center justify-end gap-2 min-w-60">
        <div className="flex items-center">
          <Airdrop />
        </div>

        <Profile></Profile>
      </div>
    </header>
  )
}
