import { Friend, Project, Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Card } from '../ui/card'
import { PageTitle } from './PageTitle'

interface Props {
  site: Site
  projects: Project[]
  className?: string
}

export function ProjectsBlock({ site, projects, className }: Props) {
  return (
    <section className={cn(className)}>
      <PageTitle className="text-center">Projects</PageTitle>
      <div className="grid grid-cols-2 gap-3 pt-6">
        {projects.map((item, index) => (
          <Card key={index} className="flex items-center gap-2">
            <a
              href={item.url}
              target="_blank"
              className="flex items-center gap-2 p-5"
            >
              <Avatar className="">
                <AvatarImage src={item.icon} />
                <AvatarFallback>{item.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="flex-col gap-1">
                <h2 className="text-base font-semibold">{item.name}</h2>
                <div className="text-sm text-foreground/50">
                  {item.introduction}
                </div>
              </div>
            </a>
          </Card>
        ))}
      </div>
    </section>
  )
}
