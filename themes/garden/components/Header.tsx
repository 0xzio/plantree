import { Profile } from '@/components/Profile/Profile'
import { Airdrop } from '@/components/theme-ui/Airdrop'
import { MembershipEntry } from '@/components/theme-ui/MembershipEntry'
import { MobileSidebarSheet } from '@/components/theme-ui/MobileSidebar'
import { NavigationItem } from '@/components/theme-ui/NavigationItem'
import { Link } from '@/lib/i18n'
import { NavLink, Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { Lobster } from 'next/font/google'
import { PostTypeNav } from './PostTypeNav'

const lobster = Lobster({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
})

interface Props {
  site: Site
}

export const Header = ({ site }: Props) => {
  const links = [
    ...site?.navLinks,
  ] as NavLink[]
  return (
    <header className="">
      <div className="flex items-center md:items-start w-full justify-between py-4 z-40 bg-background/40 backdrop-blur-sm">
        <MobileSidebarSheet site={site} />
        <div className="lg:flex items-center space-x-4 leading-5 sm:space-x-6 hidden flex-1">
          <div className="flex items-center space-x-4 text-xs">
            {links.map((link) => {
              if (link.pathname === '/creator-fi' && !site.spaceId) {
                return null
              }

              if (!link.visible) return null

              return (
                <NavigationItem
                  key={link.pathname}
                  link={link}
                  className="text-sm text-foreground/50"
                />
              )
            })}

            {site.products.length > 0 && <MembershipEntry />}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:items-center lg:justify-between gap-4 lg:mx-auto sm:max-w-xl">
            <Link
              href="/"
              className="flex items-center md:justify-center gap-2"
            >
              {site.logo && (
                <img src={site.logo} alt="" className="w-8 h-8 rounded-full" />
              )}
              <div
                className={cn(
                  'font-normal text-2xl shrink-0',
                  lobster.className,
                )}
              >
                {site.name}
              </div>
            </Link>
            <PostTypeNav className="hidden md:flex" />
          </div>
        </div>
        <div className="flex item-center justify-end gap-3 flex-1">
          <div className="flex items-center">
            <Airdrop />
          </div>
          <Profile></Profile>
        </div>
      </div>
      <PostTypeNav className="flex md:hidden" />
    </header>
  )
}
