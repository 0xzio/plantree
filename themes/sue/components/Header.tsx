import { Profile } from '@/components/Profile/Profile'
import { Airdrop } from '@/components/theme-ui/Airdrop'
import { MobileSidebarSheet } from '@/components/theme-ui/MobileSidebar'
import { Navigation } from '@/components/theme-ui/Navigation'
import { Link } from '@/lib/i18n'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'

interface Props {
  site: Site
}

export const Header = ({ site }: Props) => {
  return (
    <header
      className={cn(
        'flex items-center justify-between px-4 py-4 h-12 z-40 sticky top-0 bg-background',
      )}
    >
      <MobileSidebarSheet
        site={site}
        logo={
          <Link
            href="/"
            className="font-bold text-xl cursor-pointer w-auto md:w-60"
          >
            {site.name}
          </Link>
        }
      />

      <Link
        href="/"
        className="hidden md:inline-flex font-bold text-xl cursor-pointer w-auto md:w-60"
      >
        {site.name}
      </Link>

      <Navigation site={site} />

      <div className="flex item-center justify-end gap-2 w-40 md:w-60">
        <div className="flex items-center">
          <Airdrop />
        </div>
        <Profile></Profile>
      </div>
    </header>
  )
}
