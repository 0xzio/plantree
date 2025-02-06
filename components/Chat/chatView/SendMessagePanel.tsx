import { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SendIcon } from 'lucide-react'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import { ConnectStatusType, SocketConnector } from '../common/socketConnector'
import { ContentType, IMessageUser } from '../common/useMessages'

interface Props extends IMessageUser {
  userId: string
  channelId: string
  siteId: string
}

export const SendMessagePanel = ({
  userId,
  siteId,
  channelId,
  displayName,
  image,
}: Props) => {
  const [msgContent, setMsgContent] = useState<string>('')
  const [isComposing, setIsComposing] = useState<boolean>(false)

  const onSend = useCallback(async () => {
    if (userId && channelId && msgContent) {
      const instance = SocketConnector.getInstance()
      if (instance.getConnectionStatus().type === ConnectStatusType.connected) {
        const isOk = await instance.sendChannelMessage({
          updateId: nanoid(),
          channelId,
          siteId: siteId,
          content: msgContent.trim(),
          uid: userId,
          contentType: ContentType.TEXT,
          user: {
            displayName,
            image,
          },
        })

        if (!isOk) {
          toast.error('Failed to send message, please try again later')
        }

        setMsgContent('')
      } else {
        toast.error(instance.getConnectionStatus().msg || 'Connector not init')
      }
    }
  }, [channelId, msgContent, userId])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !isComposing) {
        e.preventDefault()
        onSend()
      }
    },
    [isComposing, onSend],
  )

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  return (
    <div className="h-full px-4 flex items-center">
      <div className="relative flex w-full items-center">
        <Input
          type="text"
          placeholder="Type a message..."
          className="w-full pr-12 pl-4 h-12 rounded-full text-base shadow"
          value={msgContent}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMsgContent(e.target.value)
          }
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />
        <Button
          size="icon"
          className="absolute right-1 rounded-full bg-foreground/10 hover:bg-foreground/5 transition-colors"
          onClick={() => onSend()}
          disabled={!msgContent.trim()}
        >
          <SendIcon size={18} className="text-foreground/80" />
        </Button>
      </div>
    </div>
  )
}
