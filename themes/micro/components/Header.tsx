import { Profile } from '@/components/Profile/Profile'
import { Airdrop } from '@/components/theme-ui/Airdrop'
import { MobileSidebarSheet } from '@/components/theme-ui/MobileSidebar'
import { Navigation } from '@/components/theme-ui/Navigation'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'

interface Props {
  site: Site
}

export const Header = ({ site }: Props) => {
  return (
    <header
      className={cn('flex items-center w-full justify-between py-4 h-16 z-40')}
    >
      <MobileSidebarSheet site={site} />
      <Navigation site={site} />

      <div className="flex item-center gap-2">
        <div className="flex items-center">
          <Airdrop />
        </div>

        <Profile></Profile>
      </div>
    </header>
  )
}
