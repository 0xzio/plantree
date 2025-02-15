'use client'

import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Post, updatePost } from '@/hooks/usePost'
import { useSiteCollaborators } from '@/hooks/useSiteCollaborators'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api, trpc } from '@/lib/trpc'
import { formatUsername } from '@/lib/utils'
import { Command } from 'cmdk'
import { Plus, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { UserAvatar } from '../UserAvatar'
import { CommandGroup, CommandInput, CommandItem } from './command-components'

export function Authors({ post }: { post: Post }) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { data: collaborators = [] } = useSiteCollaborators()
  const { mutateAsync: deleteAuthor, isPending } =
    trpc.post.deleteAuthor.useMutation()

  return (
    <div className="flex items-center gap-2">
      {post.authors.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-1 border border-foreground/10 rounded-full h-9 pl-1 pr-2"
        >
          <UserAvatar
            key={item.id}
            className="h-6 w-6"
            address={item.user.displayName || ''}
            image={item.user.image || ''}
          />

          <div className="text-sm text-foreground/60">
            {formatUsername(item.user.displayName || item.user.name || '')}
          </div>

          {post.userId !== item.userId && (
            <div
              className="inline-flex w-5 h-5 rounded-full hover:bg-foreground/50 hover:text-background items-center justify-center transition-colors cursor-pointer"
              onClick={async () => {
                try {
                  await deleteAuthor({ postId: post.id, authorId: item.id })
                  updatePost({
                    id: post.id,
                    authors: post.authors.filter(
                      (author) => author.id !== item.id,
                    ),
                  })
                  toast.success('Author removed successfully!')
                } catch (error) {
                  toast.error(extractErrorMessage(error))
                }
              }}
            >
              <XIcon size={14} />
            </div>
          )}
        </div>
      ))}

      <Popover open={isOpen} onOpenChange={setIsOpen} modal>
        <PopoverTrigger asChild className="gap-0">
          <Button
            size="xs"
            variant="outline"
            className="rounded-full h-8 w-8 p-0 border border-dashed"
            onClick={() => setIsOpen(true)}
          >
            <Plus size={18} className="text-foreground/60"></Plus>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" side="bottom" className="p-0 w-64">
          <Command label="Command Menu">
            <CommandInput
              autoFocus
              className=""
              placeholder="Select author"
              value={search}
              onValueChange={(v) => {
                setSearch(v)
              }}
            />
            <Command.List>
              <Command.Empty className="text-center text-foreground/40 py-2 text-sm">
                No results found.
              </Command.Empty>
              <CommandGroup heading={''}>
                {collaborators.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={async () => {
                      const some = post.authors.some(
                        (author) => author.userId === item.userId,
                      )

                      if (some) {
                        setIsOpen(false)
                        setSearch('')
                        return
                      }
                      try {
                        const author = await api.post.addAuthor.mutate({
                          postId: post.id,
                          userId: item.userId,
                        })
                        updatePost({
                          id: post.id,
                          authors: [...post.authors, author],
                        })
                        setIsOpen(false)
                        setSearch('')
                        toast.success('Author added successfully!')
                      } catch (error) {
                        toast.error(extractErrorMessage(error))
                      }
                    }}
                    className="cursor-pointer py-2 flex items-center gap-1"
                  >
                    <UserAvatar
                      key={item.id}
                      address={item.user.displayName || ''}
                      image={item.user.image || ''}
                    />
                    <div>
                      {formatUsername(
                        item.user.displayName || item.user.name || '',
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command.List>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
