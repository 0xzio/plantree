import { ModeToggle } from '@/components/ModeToggle'
import { Profile } from '@/components/Profile/Profile'
import { Airdrop } from '@/components/theme-ui/Airdrop'
import { SocialNav } from '@/components/theme-ui/SocialNav'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Site, Tag } from '@/lib/theme.types'
import { cn, getUrl } from '@/lib/utils'
import { slug } from 'github-slugger'
import Link from './Link'

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
      className="sidebar w-52 sticky top-0 flex-shrink-0 pt-14 pb-4 overflow-y-auto flex-col items-end pr-2 hidden md:flex"
      style={{
        height: 'calc(100vh)',
      }}
    >
      <div className="flex flex-col items-end space-y-6 flex-1 w-full">
        <Link href="/" className="px-0 py-3 flex flex-col items-end gap-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src={getUrl(site.logo || '')} />
            <AvatarFallback>{site.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="text-lg font-bold">{site.name}</div>
          {/* <div className="text-sm text-foreground/60 text-right">
            {site.description}
          </div> */}
        </Link>
        <div className="flex flex-col items-end space-y-3">
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
                  'font-medium hover:text-brand dark:hover:text-brand/80 text-foreground/90',
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
                'font-medium hover:text-brand text-foreground/90',
                'border border-brand text-brand rounded-full px-2 py-1 hover:bg-brand hover:text-background text-sm',
              )}
            >
              Membership
            </Link>
          )}
        </div>

        <div className="space-y-2">
          <div className="font-semibold text-right">Tags</div>
          <ul className="flex flex-col items-end gap-1">
            {tags.map((t) => {
              return (
                <li key={t.id} className="">
                  <Link
                    href={`/tags/${slug(t.name)}`}
                    className="text-foreground/60 py-0 hover:text-brand dark:hover:text-brand rounded-full text-right"
                    aria-label={`View posts tagged ${t.name}`}
                  >
                    #{`${t.name}`}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <SocialNav className="flex-col items-end" site={site} />
        <ModeToggle variant="outline" />
      </div>
      <div className="flex flex-col items-end gap-2 mt-auto">
        <Airdrop />
        <Profile></Profile>
      </div>
    </aside>
  )
}
