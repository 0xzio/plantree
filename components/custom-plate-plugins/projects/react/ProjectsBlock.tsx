import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Project } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'

interface Props {
  projects: Project[]
  className?: string
}

export function ProjectsBlock({ projects, className }: Props) {
  return (
    <section
      className={cn('grid grid-1 sm:grid-cols-2  gap-x-14 gap-y-6', className)}
    >
      {projects.map((item, index) => {
        return (
          <a
            key={index}
            href={item.url}
            target="_blank"
            className="flex gap-4 justify-between hover:bg-foreground/8 px-4 py-4 -mx-4 transition-all rounded-2xl hover:scale-105"
          >
            <Avatar className="rounded-none w-24 h-24">
              <AvatarImage src={item.icon} />
              <AvatarFallback>{item.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="space-y-3">
                <div className="flex-col gap-2">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <div className="text-foreground/60 leading-normal">
                    {item.introduction}
                  </div>
                </div>
              </div>
              {item.url && (
                <div className="text-sm text-foreground/50 flex gap-0.5 items-center">
                  <span className="hover:underline">
                    {new URL(item.url).host}
                  </span>
                  <ArrowUpRight size={12} className="text-foreground/60" />
                </div>
              )}
            </div>
          </a>
        )
      })}
    </section>
  )
}
