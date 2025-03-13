import { Profile } from '@/components/Profile/Profile'
import { Airdrop } from '@/components/theme-ui/Airdrop'
import { MobileSidebarSheet } from '@/components/theme-ui/MobileSidebar/MobileSidebarSheet'
import { Navigation } from '@/components/theme-ui/Navigation'
import { SocialNav } from '@/components/theme-ui/SocialNav'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from '@/lib/i18n'
import { Site } from '@/lib/theme.types'
import { cn, getUrl } from '@/lib/utils'
import { Sidebar } from './Sidebar'

interface Props {
  site: Site
}

export const Header = ({ site }: Props) => {
  return (
    <header
      className={cn(
        'flex items-center w-full px-4 xl:px-0 py-4 h-16 z-40 sticky top-0 bg-background border-b border-foreground/5 gap-2',
      )}
    >
      <MobileSidebarSheet site={site}>
        <Sidebar site={site} height="auto" />
      </MobileSidebarSheet>

      <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
        <div className="flex items-center space-x-6 leading-5 sm:space-x-6">
          <Link href="/" className="px-0 py-3 flex items-center gap-2">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={getUrl(site.logo || '')} />
              <AvatarFallback>{site.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="text-lg font-bold">{site.name}</div>
          </Link>
          <Navigation site={site} />
        </div>
        <div className="flex item-center gap-2">
          <div className="flex items-center">
            <SocialNav site={site} />
          </div>
          <div className="flex items-center">
            <Airdrop />
          </div>
          <Profile></Profile>
        </div>
      </div>
    </header>
  )
}
