import Image from 'next/image'
import { IMessage } from '../common/useMessages'

interface Props {
  message: IMessage
}

const truncateString = (str: string, maxLength: number = 16) => {
  return str?.length > maxLength ? `${str.slice(0, maxLength)}...` : str
}

export const MessageItem = ({ message }: Props) => {

  return (
    <div className="group flex items-start space-x-3 hover:bg-foreground/5 rounded-lg p-2 transition-colors">
      {/* User avatar */}
      <div className="shrink-0">
        <div className="h-10 w-10 rounded-full overflow-hidden">
          {message.user?.image ? (
            <Image
              src={message.user?.image}
              alt={message.user?.displayName}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-foreground/20">
              <span className="text-sm text-foreground/50">...</span>
            </div>
          )}
        </div>
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline space-x-2">
          <span className="font-medium text-foreground/90">
            {truncateString(message.user?.displayName || '')}
          </span>
          <span className="text-xs text-foreground/50">
            {new Date(message.createdAt).toLocaleString()}
          </span>
        </div>
        <p className="mt-1 text-foreground/70 whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>
    </div>
  )
}
