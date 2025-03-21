import { Profile } from '@/components/Profile/Profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Link } from '@/lib/i18n'
import { Site } from '@/lib/theme.types'
import { cn, getUrl } from '@/lib/utils'
import { PenToolIcon } from 'lucide-react'
import { Merienda } from 'next/font/google'
import { CreatePostButton } from './CreatePostButton'
import { Nav } from './Nav'

const merienda = Merienda({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

interface Props {
  site: Site
  className?: string
}

export const Header = ({ site, className }: Props) => {
  return (
    <header className={cn('z-40 bg-background', className)}>
      <div
        className={cn('flex justify-center items-center w-full py-4 h-16 px-3')}
      >
        <div className="flex items-center justify-start w-40">
          <Link
            href="/"
            aria-label={site.name}
            className="flex items-center justify-between gap-2"
          >
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={getUrl(site.logo || '')} />
              <AvatarFallback>{site.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
        <div className="flex items-center gap-3 flex-1 justify-center">
          <div className={cn('text-2xl font-semibold', merienda.className)}>
            {site.name}
          </div>
          <div className="text-foreground/40">{site.description}</div>
        </div>

        <div className="flex items-center justify-end gap-1 w-40">
          <CreatePostButton site={site} />
          <Profile appearance="icon"></Profile>
        </div>
      </div>
      <Nav site={site} />
    </header>
  )
}
