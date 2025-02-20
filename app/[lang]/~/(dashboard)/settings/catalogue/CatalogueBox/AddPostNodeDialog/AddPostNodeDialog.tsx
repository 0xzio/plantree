'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Menu, MenuItem } from '@/components/ui/menu'
import { usePosts } from '@/hooks/usePosts'
import { CatalogueNodeType } from '@/lib/model'
import { PostStatus } from '@prisma/client'
import { useCatalogue } from '../hooks/useCatalogue'
import { useAddPostNodeDialog } from './useAddPostNodeDialog'

interface Props {}

export function AddPostNodeDialog({}: Props) {
  const { isOpen, setIsOpen, parentId } = useAddPostNodeDialog()
  const { data = [] } = usePosts()
  const { addNode } = useCatalogue()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px] grid gap-4">
        <DialogHeader>
          <DialogTitle className="">Select a post</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <Menu className="shadow-none">
          {data.map((post) => {
            if (post.postStatus !== PostStatus.PUBLISHED) return null
            return (
              <MenuItem
                key={post.id}
                onClick={() => {
                  addNode(
                    {
                      uri: post.slug,
                      title: post.title,
                      type: CatalogueNodeType.POST,
                    },
                    parentId,
                  )
                  setIsOpen(false)
                }}
              >
                {post.title}
              </MenuItem>
            )
          })}
        </Menu>
      </DialogContent>
    </Dialog>
  )
}
