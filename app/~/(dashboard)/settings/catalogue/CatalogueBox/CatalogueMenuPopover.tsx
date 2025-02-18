import { FC, PropsWithChildren } from 'react'
import { Menu, MenuItem } from '@/components/ui/menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CatalogueNode } from '@/lib/catalogue'
import { CatalogueNodeType, ICatalogueNode } from '@/lib/model'
import { Box } from '@fower/react'
import { PopoverClose } from '@radix-ui/react-popover'
import { MoreHorizontal, Trash2, User } from 'lucide-react'
import { useCategoryNodeDialog } from './CategoryNodeDialog/useCategoryNodeDialog'
import { useCatalogue } from './hooks/useCatalogue'

interface Props {
  node: ICatalogueNode
}

export const CatalogueMenuPopover: FC<PropsWithChildren<Props>> = ({
  node,
}) => {
  const { deleteNode } = useCatalogue()
  const { setState } = useCategoryNodeDialog()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Box
          toCenter
          square6
          cursorPointer
          rounded
          bgGray200--hover
          inlineFlex
          gray600
        >
          <MoreHorizontal size={16} />
        </Box>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-56">
        {node.type === CatalogueNodeType.CATEGORY && (
          <PopoverClose asChild>
            <MenuItem
              onClick={async (e) => {
                e.stopPropagation()
                //
                setState({
                  isOpen: true,
                  parentId: node.id,
                  node,
                })
              }}
            >
              <Box>Rename</Box>
            </MenuItem>
          </PopoverClose>
        )}
        <PopoverClose asChild>
          <MenuItem
            onClick={async (e) => {
              e.stopPropagation()
              deleteNode(node.id)
            }}
          >
            <Box>Delete</Box>
          </MenuItem>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}
