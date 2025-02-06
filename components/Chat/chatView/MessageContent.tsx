import { useEffect, useRef, useState } from 'react'
import { trpc } from '@/lib/trpc'
import { toast } from 'sonner'
import { useThrottledCallback } from 'use-debounce'
import { IMessage, useMessages } from '../common/useMessages'
import { MessageItem } from './MessageItem'

interface Props {
  channelId: string
}

export const MessageContent = ({ channelId }: Props) => {
  const [isLoading, setIsLoading] = useState(true)
  const { getMessagesState, addMessages } = useMessages()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { isPending, mutateAsync } = trpc.message.listByChannelId.useMutation()
  const [pageCount, setPageCount] = useState<number>(1)
  const { messages, currentPage, isNew } = getMessagesState(channelId)

  const fetchMessages = async (channelId: string, page: number = 1) => {
    setIsLoading(true)
    try {
      const res = await mutateAsync({ channelId, page })
      addMessages(
        channelId,
        [...(res.messages.reverse() as IMessage[])],
        res.currentPage,
        page === 1,
      )
      if (page === 1) {
        setPageCount(res.pageCount)
      }
    } catch (err) {
      console.error('Error fetching messages:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleScroll = useThrottledCallback(() => {
    const container = containerRef.current
    if (!container) return

    if (container.scrollTop === 0) {
      if (currentPage < pageCount) {
        fetchMessages(channelId, currentPage + 1)
      } else {
        messages.length > 20 && toast.warning('There are no more new messages')
      }
    }
  }, 800)

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  useEffect(() => {
    if (!messages.length) {
      fetchMessages(channelId)
    }
  }, [channelId])

  useEffect(() => {
    if (messages.length > 4 && isNew) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div ref={containerRef} className="h-full overflow-y-auto px-4">
      {messages.length ? (
        <div className="flex flex-col space-y-4 py-4">
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="text-foreground/50">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40"></div>
              </div>
            ) : (
              'No messages yet'
            )}
          </span>
        </div>
      )}
    </div>
  )
}
