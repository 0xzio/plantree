import { Profile } from '@/components/Profile/Profile'
import { Airdrop } from '@/components/theme-ui/Airdrop'
import { MobileSidebarSheet } from '@/components/theme-ui/MobileSidebar'
import { Navigation } from '@/components/theme-ui/Navigation'
import { Link } from '@/lib/i18n'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { Merienda } from 'next/font/google'

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
                className="font-medium hover:text-brand dark:hover:text-brand/80 text-foreground/90"
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
