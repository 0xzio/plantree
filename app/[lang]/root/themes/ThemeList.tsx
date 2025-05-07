import { Link } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import {
  ArrowUpRight,
  BotIcon,
  BugIcon,
  MailIcon,
  MessageCircleMore,
  PaletteIcon,
  PencilIcon,
  RocketIcon,
  UserIcon,
  ZapIcon,
} from 'lucide-react'

const themes: string[] = [
  'minimal',
  'micro',
  'aside',
  'publication',
  'square',
  'sue',
  'paper',
  'wide',
  'garden',
  'maple',
  'card',
  'docs',
]

export function ThemeList() {
  return (
    <div className="mt-10 space-y-10">
      <div className="text-center space-y-4">
        <div className="text-6xl font-bold">Themes</div>
        <div className="text-xl text-foreground/60">
          Some beautiful themes for PenX.
        </div>
      </div>
      <div className="bg-transparent">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 border-foreground/10 overflow-hidden border-l border-t justify-center">
          {themes.map((theme, index) => {
            let host = `theme-${theme}.plantree.xyz`
            if (theme === 'docs') host = 'docs.plantree.xyz'
            const link = `https://${host}`
            return (
              <div
                key={index}
                className={cn(
                  'p-8 border-foreground/10 space-y-3 bg-background/30 border-r border-b group transition-all',
                )}
              >
                <div className="text-5xl font-bold">{theme.toUpperCase()}</div>
                <a
                  href={link}
                  target="_blank"
                  className="text-base text-foreground/50 hover:text-foreground/90 transition-all group-hover:scale-105 flex gap-0.5"
                >
                  <span>{host}</span>
                  <ArrowUpRight size={16} className="text-foreground/60" />
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
