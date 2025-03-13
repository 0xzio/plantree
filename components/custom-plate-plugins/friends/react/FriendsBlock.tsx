import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Friend } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'
import { SubmitFriendLinkDialog } from './SubmitFriendLinkDialog/SubmitFriendLinkDialog'

interface Props {
  friends: Friend[]
  className?: string
}

export function FriendsBlock({ friends, className }: Props) {
  console.log('======friends:', friends)

  const reviewedFriends = friends.filter(
    (friend) => friend.status === 'approved',
  )
  const pendingFriends = friends.filter((friend) => friend.status === 'pending')
  return (
    <section className={cn('flex flex-col gap-6', className)}>
      <SubmitFriendLinkDialog />
      <div className="space-y-8">
        <FriendList friends={reviewedFriends} />
        <div className="space-y-3">
          <Badge variant="secondary">
            <div className="text-sm">Reviewing</div>
          </Badge>
          <FriendList pending friends={pendingFriends} />
        </div>
      </div>
    </section>
  )
}

function FriendList({
  friends,
  pending = false,
}: Props & { pending?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      {friends.map((item, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center gap-2',
            pending && 'opacity-45 cursor-not-allowed',
          )}
        >
          <Avatar className="w-7 h-7">
            <AvatarImage src={item.avatar} />
            <AvatarFallback>{item.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          {pending && (
            <div className="font-bold flex gap-0.5">
              <span>{item.name}</span>
              <ArrowUpRight size={16} className="text-foreground/60" />
            </div>
          )}

          {!pending && (
            <a
              href={item.url}
              target="_blank"
              className="font-bold hover:underline flex gap-0.5"
            >
              <span>{item.name}</span>
              <ArrowUpRight size={16} className="text-foreground/60" />
            </a>
          )}
          <div className="text-sm text-foreground/60">{item.introduction}</div>
        </div>
      ))}
    </div>
  )
}
