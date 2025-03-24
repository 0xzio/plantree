import { ModeToggle } from '@/components/ModeToggle'
import { Profile } from '@/components/Profile/Profile'
import { Airdrop } from '@/components/theme-ui/Airdrop'
import { MembershipEntry } from '@/components/theme-ui/MembershipEntry'
import { SocialNav } from '@/components/theme-ui/SocialNav'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from '@/lib/i18n'
import { Site, Tag } from '@/lib/theme.types'
import { cn, getUrl } from '@/lib/utils'
import { slug } from 'github-slugger'

interface Props {
  site: Site
  tags: Tag[]
}

export const Sidebar = ({ site, tags }: Props) => {
  const links = [
    ...site?.navLinks,
    {
      pathname: '/creator-fi',
      title: 'CreatorFi',
      visible: true,
    },
  ]
  return (
    <aside
      className="sidebar w-52 sticky top-0 shrink-0 pl-8 pb-4 overflow-y-auto flex-col pr-2 hidden md:flex"
      style={{
        height: 'calc(100vh)',
      }}
    >
      <div className="flex flex-col space-y-6 flex-1 w-full">
        <Link href="/" className="px-0 py-3 flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={getUrl(site.logo || '')} />
            <AvatarFallback>{site.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="text-lg font-bold">{site.name}</div>
        </Link>
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-8 -mt-40">
            <div className="flex flex-col space-y-3">
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
                      'text-sm font-medium hover:text-brand dark:hover:text-brand/80 text-foreground/80 hover:scale-105 transition-all',
                    )}
                  >
                    {link.title}
                  </Link>
                )
              })}
            </div>

            <div className="space-y-2">
              <div className="font-medium">Tags</div>
              <ul className="flex flex-col gap-1">
                {tags.map((t) => {
                  return (
                    <li key={t.id} className="">
                      <Link
                        href={`/tags/${slug(t.name)}`}
                        className="text-foreground/60 py-0 hover:text-brand dark:hover:text-brand rounded-full hover:scale-105 transition-all"
                        aria-label={`View posts tagged ${t.name}`}
                      >
                        #{`${t.name}`}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="flex flex-col gap-2 mt-auto">
              <Airdrop />
              <Profile
                buttonProps={{
                  // variant: 'default',
                  variant: 'outline-solid',
                  size: 'xs',
                  className: 'w-16',
                }}
              />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {site.products.length > 0 && (
            <div>
              <MembershipEntry className="inline-flex" />
            </div>
          )}
          <div className="flex items-center justify-between">
            <SocialNav className="" site={site} size={4} />
            <ModeToggle
              variant="outline"
              className="h-7 w-7 fixed top-3 right-3"
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
