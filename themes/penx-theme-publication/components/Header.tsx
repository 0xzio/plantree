import { ReactNode, Suspense } from 'react'
import { Site } from '@/lib/theme.types'
import { cn } from '@penxio/utils'
import { Merienda } from 'next/font/google'
import Link from './Link'
import { Nav } from './Nav'

const merienda = Merienda({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const headerNavLinks = [
  { href: '/', title: 'Home' },
  { href: '/posts', title: 'Blog' },
  { href: '/tags', title: 'Tags' },
  { href: '/about', title: 'About' },
  { href: '/membership', title: 'Membership', isMembership: true },
]

const headerNavLinksRight = [{ href: '/creator-fi', title: 'CreatorFi' }]

interface Props {
  site: Site
  Logo: () => ReactNode
  ModeToggle: () => ReactNode
  MobileNav: () => ReactNode
  ConnectButton: () => ReactNode
  Airdrop: () => ReactNode
}

export const Header = ({
  site,
  Logo,
  ModeToggle,
  MobileNav,
  ConnectButton,
  Airdrop,
}: Props) => {
  return (
    <header className="z-40">
      <div
        className={cn('flex justify-center items-center w-full py-4 h-16 px-4')}
      >
        <div className="flex-1"></div>
        <div className="flex-1 flex items-center justify-center">
          <Link href="/" aria-label={site.name}>
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  'hidden h-6 text-2xl font-semibold sm:block',
                  merienda.className,
                )}
              >
                {site.name}
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center justify-end flex-1 gap-4">
          <div className="no-scrollbar hidden items-center space-x-4 overflow-x-auto sm:flex sm:space-x-6">
            {headerNavLinksRight.map((link) => {
              if (link.href === '/creator-fi' && !site.spaceId) {
                return null
              }
              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className="font-medium hover:text-brand-500 dark:hover:text-brand-400 text-foreground/90"
                >
                  {link.title}
                </Link>
              )
            })}
          </div>

          {MobileNav && <MobileNav />}

          {Airdrop && (
            <div className="flex items-center">
              <Airdrop />
            </div>
          )}

          {ConnectButton && (
            <Suspense fallback={<div></div>}>
              <ConnectButton />
            </Suspense>
          )}
        </div>
      </div>
      <Nav site={site} />
    </header>
  )
}
