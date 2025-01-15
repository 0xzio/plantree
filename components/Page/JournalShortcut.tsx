import { forwardRef } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { addDays, format, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props extends FowerHTMLProps<'div'> {
  date?: string
}

export const JournalShortcut = forwardRef<HTMLDivElement, Props>(
  function DailyShortcut({ date, ...rest }, ref) {
    const currentDate = new Date(date ?? Date.now())
    const { push } = useRouter()

    return (
      <Box ref={ref} textXS fontNormal toCenterY {...rest}>
        <Box
          bgGray100
          px2
          py-6
          roundedFull
          bgGray200--hover
          transitionColors
          cursorPointer
          onClick={() => {
            const dateStr = format(new Date(), 'yyyy-MM-dd')
            push(`/~/page?id=${dateStr}`)
          }}
        >
          Today
        </Box>
        <Box toCenterY gap2 ml2>
          <Box
            bgGray100
            circle5
            toCenter
            bgGray200--hover
            transitionColors
            cursorPointer
            onClick={() => {
              const dateStr = format(subDays(currentDate, 1), 'yyyy-MM-dd')
              push(`/~/page?id=${dateStr}`)
            }}
          >
            <ChevronLeft size={16} />
          </Box>
          <Box
            bgGray100
            circle5
            toCenter
            bgGray200--hover
            transitionColors
            cursorPointer
            onClick={() => {
              const dateStr = format(addDays(currentDate, 1), 'yyyy-MM-dd')
              push(`/~/page?id=${dateStr}`)
            }}
          >
            <ChevronRight size={16} />
          </Box>
        </Box>
      </Box>
    )
  },
)
