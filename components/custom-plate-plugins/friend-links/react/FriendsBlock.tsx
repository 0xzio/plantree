import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Friend } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'
import { SubmitFriendLinkDialog } from './SubmitFriendLinkDialog/SubmitFriendLinkDialog'

interface Props {
  friends: Friend[]
  className?: string
}

export function FriendsBlock({ friends, className }: Props) {
  return (
    <section className={cn('flex flex-col gap-6', className)}>
      <SubmitFriendLinkDialog />
      <div className="flex flex-col gap-3">
        {friends.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Avatar className="w-7 h-7">
              <AvatarImage src={item.avatar} />
              <AvatarFallback>{item.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <a
              href={item.url}
              target="_blank"
              className="font-bold hover:underline flex gap-0.5"
            >
              <span>{item.name}</span>
              <ArrowUpRight size={16} className="text-foreground/60" />
            </a>
            <div className="text-sm text-foreground/60">
              {item.introduction}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
