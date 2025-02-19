import { useState } from 'react'
import { Menu, MenuItem } from '@/components/ui/menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import { useAddPageNodeDialog } from './AddPageNodeDialog/useAddPageNodeDialog'
import { useAddPostNodeDialog } from './AddPostNodeDialog/useAddPostNodeDialog'
import { useCategoryNodeDialog } from './CategoryNodeDialog/useCategoryNodeDialog'
import { useLinkNodeDialog } from './LinkNodeDialog/useLinkNodeDialog'

interface Props {
  parentId?: string
}

export function AddNodePopover({ parentId = '' }: Props) {
  const [open, setOpen] = useState(false)
  const addPostNodeDialog = useAddPostNodeDialog()
  const addPageNodeDialog = useAddPageNodeDialog()
  const categoryNodeDialog = useCategoryNodeDialog()
  const linkNodeDialog = useLinkNodeDialog()
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Box
          toCenter
          square6
          cursorPointer
          rounded
          bgGray200--hover
          inlineFlex
          gray600
          onClick={async (e) => {
            e.stopPropagation()
          }}
        >
          <Plus size={16} />
        </Box>
      </PopoverTrigger>
      <PopoverContent asChild className="p-0 w-48">
        <Menu>
          <MenuItem
            onClick={async () => {
              categoryNodeDialog.setState({
                parentId,
                isOpen: true,
              })
              setOpen(false)
            }}
          >
            Category
          </MenuItem>
          <MenuItem
            onClick={() => {
              addPostNodeDialog.setState({
                parentId,
                isOpen: true,
              })
              setOpen(false)
            }}
          >
            Post
          </MenuItem>
          <MenuItem
            onClick={() => {
              addPageNodeDialog.setState({
                parentId,
                isOpen: true,
              })
              setOpen(false)
            }}
          >
            Page
          </MenuItem>
          <MenuItem
            onClick={() => {
              linkNodeDialog.setState({
                parentId,
                isOpen: true,
              })
              setOpen(false)
            }}
          >
            Link
          </MenuItem>
        </Menu>
      </PopoverContent>
    </Popover>
  )
}
