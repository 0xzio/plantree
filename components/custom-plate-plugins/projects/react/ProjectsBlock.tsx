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
    <section className={cn(className)}>
      <div className="grid grid-1 sm:grid-cols-2 gap-x-14 gap-y-10 pt-6">
        {projects.map((item, index) => {
          return (
            <a
              key={index}
              href={item.url}
              target="_blank"
              className="flex flex-col gap-2 justify-between hover:bg-foreground/5 px-4 py-4 -mx-4 transition-colors rounded-2xl"
            >
              <div className="space-y-3">
                <Avatar className="">
                  <AvatarImage src={item.icon} />
                  <AvatarFallback>{item.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="flex-col gap-1">
                  <h2 className="text-base font-semibold">{item.name}</h2>
                  <div className="text-foreground/80">{item.introduction}</div>
                </div>
              </div>
              {item.url && (
                <div className="text-sm text-foreground/50 flex hover:underline gap-0.5 items-center">
                  <span>{new URL(item.url).host}</span>
                  <ArrowUpRight size={12} className="text-foreground/60" />
                </div>
              )}
            </a>
          )
        })}
      </div>
    </section>
  )
}
