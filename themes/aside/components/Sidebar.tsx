import { ModeToggle } from '@/components/ModeToggle'
import { Profile } from '@/components/Profile/Profile'
import { Airdrop } from '@/components/theme-ui/Airdrop'
import { MembershipEntry } from '@/components/theme-ui/MembershipEntry'
import { NavigationItem } from '@/components/theme-ui/NavigationItem'
import { SocialNav } from '@/components/theme-ui/SocialNav'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from '@/lib/i18n'
import { NavLink, Site, Tag } from '@/lib/theme.types'
import { cn, getUrl } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { slug } from 'github-slugger'

interface Props {
  site: Site
  tags: Tag[]
}

export const Sidebar = ({ site, tags }: Props) => {
  const links = [...site?.navLinks] as NavLink[]
  return (
    <aside
      className="sidebar w-64 sticky top-0 shrink-0 pt-24 pb-4 overflow-y-auto flex-col pr-2 hidden md:flex"
      style={{
        height: 'calc(100vh)',
      }}
    >
      <div className="flex flex-col space-y-6 flex-1 w-full">
        <div>
          <Link href="/" className="px-0 py-2 flex flex-col gap-2">
            {/* <Avatar className="h-32 w-32 rounded-2xl">
              <AvatarImage src={getUrl(site.logo || '')} />
              <AvatarFallback>{site.name.slice(0, 1)}</AvatarFallback>
            </Avatar> */}
            <div className="text-3xl font-bold">{site.name}</div>
          </Link>
          <div className="text-foreground/60 text-lg font-light">
            {site.description}
          </div>
        </div>
        {site.products.length > 0 && (
          <div>
            <MembershipEntry className="py-1.5 px-3" />
          </div>
        )}

        <SocialNav className="" site={site} size={4} />
        <div className="flex flex-col gap-3">
          {links.map((link) => {
            if (link.pathname === '/creator-fi' && !site.spaceId) {
              return null
            }

            if (!link.visible) return null

            return (
              <div key={link.pathname}>
                <NavigationItem
                  link={link}
                  className="justify-start font-medium inline-flex"
                />
              </div>
            )
          })}
        </div>

        {!!tags.length && (
          <div className="space-y-2">
            <div className="font-semibold">
              <Trans>Tags</Trans>
            </div>
            <ul className="flex flex-col gap-1">
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
        )}
      </div>
      <div className="flex gap-2 mt-auto items-center justify-between">
        <Airdrop />
        <Profile
          buttonProps={{
            size: 'sm',
            variant: 'outline',
            className: 'w-20',
          }}
        />
      </div>
    </aside>
  )
}
