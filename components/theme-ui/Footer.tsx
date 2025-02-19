import { ModeToggle } from '@/components/ModeToggle'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { SocialNav } from './SocialNav'

interface Props {
  site: Site
  className?: string
}

export function Footer({ site, className }: Props) {
  if (!site) return null
  return (
    <footer className={cn('mt-auto mb-8', className)}>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4 item-center"></div>
        <SocialNav className="mb-3" site={site} />
        <div className="mb-2 flex space-x-2 text-sm item-center text-card-foreground/50">
          <div className="flex items-center">{`© ${new Date().getFullYear()}`}</div>
          <div className="flex items-center">{` • `}</div>
          <div className="flex items-center">{site.name}</div>
          <div className="flex items-center">{` • `}</div>
          <div className="flex items-center gap-1">
            Build with
            <a
              href="https://penx.io"
              target="_blank"
              className="text-brand-500"
            >
              PenX
            </a>
          </div>
          <ModeToggle />
        </div>
      </div>
    </footer>
  )
}
