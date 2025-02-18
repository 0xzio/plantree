import { useState } from 'react'
import { Menu, MenuItem } from '@/components/ui/menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import { useCategoryNodeDialog } from './CategoryNodeDialog/useCategoryNodeDialog'
import { useAddPostNodeDialog } from './AddPostNodeDialog/useAddPostNodeDialog'

interface Props {
  parentId?: string
}

export function AddNodePopover({ parentId = '' }: Props) {
  const [open, setOpen] = useState(false)
  const addPostNodeDialog = useAddPostNodeDialog()
  const addCategoryNodeDialog = useCategoryNodeDialog()
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
      <PopoverContent asChild className="p-0 w-60">
        <Menu>
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
          {/* <MenuItem>Link</MenuItem> */}
          <MenuItem
            onClick={async () => {
              // await addNode({
              //   type: CatalogueNodeType.CATEGORY,
              // })

              addCategoryNodeDialog.setState({
                parentId,
                isOpen: true,
              })
              setOpen(false)
            }}
          >
            Category
          </MenuItem>
        </Menu>
      </PopoverContent>
    </Popover>
  )
}
