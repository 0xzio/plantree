import { Skeleton } from '@/components/ui/skeleton'
import { Box, FowerHTMLProps } from '@fower/react'

interface Props extends FowerHTMLProps<'div'> {
  isLoading: boolean
}

export function GithubConnectionBox({ children, isLoading, ...rest }: Props) {
  return (
    <Box {...rest}>
      {isLoading && (
        <Box toBetween>
          <Box toCenter gap2>
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-8 w-32" />
          </Box>
          <Skeleton className="w-32 h-11 rounded-2xl" />
        </Box>
      )}

      {!isLoading && <Box>{children}</Box>}
    </Box>
  )
}
