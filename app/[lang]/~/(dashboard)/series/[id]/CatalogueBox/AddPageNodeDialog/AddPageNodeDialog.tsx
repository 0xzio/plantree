'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Menu, MenuItem } from '@/components/ui/menu'
import { usePages } from '@/hooks/usePages'
import { CatalogueNodeType } from '@/lib/model'
import { PostStatus } from '@prisma/client'
import { useCatalogue } from '../hooks/useCatalogue'
import { useAddPageNodeDialog } from './useAddPageNodeDialog'

interface Props {}

export function AddPageNodeDialog({}: Props) {
  const { isOpen, setIsOpen, parentId } = useAddPageNodeDialog()
  const { data = [] } = usePages()
  const { addNode } = useCatalogue()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px] grid gap-4">
        <DialogHeader>
          <DialogTitle className="">Select a page</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <Menu className="shadow-none">
          {data.map((item) => {
            if (item.status !== PostStatus.PUBLISHED) return null
            return (
              <MenuItem
                key={item.id}
                onClick={() => {
                  addNode(
                    {
                      uri: item.slug,
                      title: item.title,
                      type: CatalogueNodeType.PAGE,
                    },
                    parentId,
                  )
                  setIsOpen(false)
                }}
              >
                {item.title}
              </MenuItem>
            )
          })}
        </Menu>
      </DialogContent>
    </Dialog>
  )
}
