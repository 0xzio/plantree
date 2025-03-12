import { Profile } from '@/components/Profile/Profile'
import { Airdrop } from '@/components/theme-ui/Airdrop'
import { MobileSidebarSheet } from '@/components/theme-ui/MobileSidebar'
import { Navigation } from '@/components/theme-ui/Navigation'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'

interface Props {
  site: Site
  className?: string
}

export const Header = ({ site, className }: Props) => {
  return (
    <header className="-mx-10">
      <div className="flex item-center gap-2 justify-between p-4">
        <div>
          <MobileSidebarSheet site={site} />
        </div>
        {/* <div className="flex items-center">
          <Airdrop />
        </div> */}
        <Profile></Profile>
      </div>
      <div className="flex flex-col items-center pt-2 pb-10 px-10">
        <h1 className="text-3xl font-bold">{site.name}</h1>
        <div className="text-foreground/70">{site.description}</div>
      </div>
      <div
        className={cn(
          'items-center justify-center w-full py-4 h-12 z-40 border-t border-b border-foreground/5 hidden md:flex',
          className,
        )}
      >
        <Navigation site={site} />
      </div>
    </header>
  )
}
