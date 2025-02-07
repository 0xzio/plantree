import { Site } from '@penxio/types'
import { cn } from '@penxio/utils'
import { Merienda } from 'next/font/google'
import Link from './Link'

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

interface Props {
  site: Site
}

export const Nav = ({ site }: Props) => {
  return (
    <div className="flex justify-center items-center space-x-4 overflow-x-auto sm:flex sm:space-x-6 border-t border-b h-12 border-foreground/5">
      {headerNavLinks.map((link) => {
        if (link.href === '/membership' && !site.spaceId) {
          return null
        }
        return (
          <Link
            key={link.title}
            href={link.href}
            className={cn(
              'font-medium hover:text-brand-500 dark:hover:text-brand-400 text-foreground/90',
              link.isMembership &&
                'border border-brand-500 text-brand-500 rounded-full px-2 py-1 hover:bg-brand-500 hover:text-background text-sm',
            )}
          >
            {link.title}
          </Link>
        )
      })}
    </div>
  )
}
