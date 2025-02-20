import { useEffect, useMemo } from 'react'
import { trpc } from '@/lib/trpc'
import { Channel } from '@prisma/client'
import { SocketConnector } from '../common/socketConnector'
import { IMessageUser } from '../common/useMessages'
import { MessageContent } from './MessageContent'
import { SendMessagePanel } from './SendMessagePanel'

export const dynamic = 'force-static'

interface Props extends IMessageUser {
  userId: string
  siteId: string
  token: string
  channels: Channel[]
}

export default function ChatView({
  channels,
  siteId,
  userId,
  token,
  displayName,
  image,
}: Props) {
  const channel = useMemo<Channel>(() => {
    return channels[0]!
  }, [channels])

  useEffect(() => {
    if (channel) {
      const channelId = channel.id
      const socketInstance = SocketConnector.getInstance()
      if (!socketInstance) {
        new SocketConnector(token, [channelId])
      } else {
        socketInstance.joinChannels([channelId])
      }
    }

    return () => {
      const socketInstance = SocketConnector.getInstance()
      if (socketInstance && channel) {
        socketInstance.leaveChannels([channel.id])
      }
    }
  }, [channel, token])

  const { data: userInfo } = trpc.user.getUserInfoByUserId.useQuery(
    { userId: userId },
    {
      enabled: !!userId,
    },
  )

  return (
    <div className="-mx-4 h-[calc(100vh-7rem)] flex flex-col">
      <div className="flex-1 overflow-hidden">
        <MessageContent channelId={channel.id} />
      </div>

      <div className="flex-shrink-0 -mb-4">
        <SendMessagePanel
          channelId={channel.id}
          siteId={siteId}
          userId={userId}
          displayName={userInfo?.displayName || displayName}
          image={userInfo?.image || image}
        />
      </div>
    </div>
  )
}
