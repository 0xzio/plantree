import { ModeToggle } from '@/components/ModeToggle'
import { Link } from '@/lib/i18n'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { ContributeButton } from './ContributeButton'
import { LangSwitcher } from './LangSwitcher'
import { SocialNav } from './SocialNav'

interface Props {
  site: Site
  className?: string
}

export function Footer({ site, className }: Props) {
  if (!site) return null
  return (
    <footer className={cn('mt-auto mb-4', className)}>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4 item-center"></div>
        <SocialNav className="mb-3" site={site} />
        <div className="mb-2 flex space-x-2 text-sm item-center text-foreground/50">
          <div className="flex items-center">{`© ${new Date().getFullYear()}`}</div>
          <div className="flex items-center">{` • `}</div>
          <div className="flex items-center">{site.name}</div>
          <div className="flex items-center">{` • `}</div>
          <div className="flex items-center gap-1">
            Build with
            <a href="https://plantree.xyz" target="_blank" className="text-brand">
              Plantree
            </a>
          </div>
          <div className="hidden md:flex items-center">{` • `}</div>
          <div className="hidden md:flex items-center">
            <Link href="/posts/feed.xml" target="_blank">
              RSS
            </Link>
          </div>

          <ModeToggle className="hidden md:flex" />
          <LangSwitcher className="hidden md:flex" site={site} />
          <ContributeButton site={site} />
        </div>
      </div>
    </footer>
  )
}
