import { Friend, Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { PageTitle } from './PageTitle'

interface Props {
  site: Site
  friends: Friend[]
  className?: string
}

export function FriendsBlock({ site, friends, className }: Props) {
  return (
    <section className={cn(className)}>
      <PageTitle>Friends</PageTitle>
      <div>
        {friends.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Avatar className="w-7 h-7">
              <AvatarImage src={item.avatar} />
              <AvatarFallback>{item.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <a href={item.url} target="_blank" className="text-brand">
              {item.name}
            </a>
            <div>{item.introduction}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
