import { Profile } from '@/components/Profile/Profile'
import { Airdrop } from '@/components/theme-ui/Airdrop'
import { MobileSidebarSheet } from '@/components/theme-ui/MobileSidebar'
import { Navigation } from '@/components/theme-ui/Navigation'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { Merienda } from 'next/font/google'
import Link from './Link'

const merienda = Merienda({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const headerNavLinksRight = [{ href: '/creator-fi', title: 'CreatorFi' }]

interface Props {
  site: Site
}

export const Header = ({ site }: Props) => {
  return (
    <header
      className={cn(
        'flex items-center justify-between w-full py-4 h-16 z-40 gap-2',
      )}
    >
      <MobileSidebarSheet site={site} />
      <Navigation site={site} className="w-80" />
      <div className="flex-1 flex justify-start md:justify-center">
        <Link
          href="/"
          aria-label={site.name}
          className={cn(
            'h-6 text-lg md:text-2xl font-semibold',
            merienda.className,
          )}
        >
          {site.name}
        </Link>
      </div>
      <div className="flex items-center justify-end gap-4 w-80">
        <div className="space-x-4 flex items-center sm:space-x-6">
          {headerNavLinksRight.map((link) => {
            if (link.href === '/creator-fi' && !site.spaceId) {
              return null
            }
            return (
              <Link
                key={link.title}
                href={link.href}
                className="font-medium hover:text-brand-500 dark:hover:text-brand-400 text-foreground/90"
              >
                {link.title}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center">
          <Airdrop />
        </div>

        <Profile></Profile>
      </div>
    </header>
  )
}
