import { MembershipEntry } from '@/components/theme-ui/MembershipEntry'
import { Link } from '@/lib/i18n'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'

interface Props {
  site: Site
}

export const Nav = ({ site }: Props) => {
  return (
    <div className="flex border-t border-b h-12 border-foreground/5 border-b-foreground/10">
      <div className="flex justify-center lg:max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-6">
          {site.navLinks.map((link) => {
            if (!link.visible) return null
            return (
              <Link
                key={link.title}
                href={link.pathname}
                className={cn(
                  'font-medium hover:text-brand dark:hover:text-brand/80 text-foreground/90',
                )}
              >
                {link.title}
              </Link>
            )
          })}

          <div className="h-full flex items-center">
            <MembershipEntry className="py-1.5 px-3" />
          </div>
        </div>
      </div>
    </div>
  )
}
