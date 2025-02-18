import { Profile } from '@/components/Profile/Profile'
import { Airdrop } from '@/components/theme-ui/Airdrop'
import { SocialNav } from '@/components/theme-ui/SocialNav'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Site } from '@/lib/theme.types'
import { cn, getUrl } from '@/lib/utils'
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
        'flex items-center w-full py-4 h-16 z-40 sticky top-0 bg-background border-b border-foreground/5',
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
        <div className="flex items-center space-x-6 leading-5 sm:space-x-6">
          <div className="px-0 py-3 flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={getUrl(site.logo || '')} />
              <AvatarFallback>{site.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="text-lg font-bold">{site.name}</div>
          </div>
          <div className="flex items-center space-x-4">
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
                    'font-medium hover:text-brand-500 dark:hover:text-brand-400 text-foreground/90',
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
                  'font-medium hover:text-brand-500 text-foreground/90',
                  'border border-brand-500 text-brand-500 rounded-full px-2 py-1 hover:bg-brand-500 hover:text-background text-sm',
                )}
              >
                Membership
              </Link>
            )}
          </div>
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
