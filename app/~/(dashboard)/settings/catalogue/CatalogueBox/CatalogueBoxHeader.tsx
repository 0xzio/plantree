import { Box } from '@fower/react'
import { AddNodePopover } from './AddNodePopover'

export const CatalogueBoxHeader = () => {
  return (
    <Box toCenterY toBetween gap2 my2>
      <Box fontBold ml2 textSM>
        Catalogue
      </Box>
      <AddNodePopover />
    </Box>
  )
}
